---
name: database-migrations
description: "Zero-downtime database migration patterns. PostgreSQL, Oracle, Django. Safety checklist, expand-contract, batch migrations. Keywords: migration, ALTER TABLE, index, zero-downtime, rollback."
---

# Database Migration Patterns

## Core Principles

1. **Every change is a migration** — never ALTER production manually
2. **Forward-only** — rollbacks use new forward migrations
3. **Separate schema and data** — never mix DDL + DML in one migration
4. **Test on production-sized data** — 100 rows OK ≠ 10M rows OK
5. **Immutable once deployed** — never edit a migration that ran in production

## Safety Checklist

Before applying any migration:

- [ ] Has both UP and DOWN (or marked irreversible)
- [ ] No full table locks on large tables
- [ ] New columns: nullable or with DEFAULT
- [ ] Indexes: created CONCURRENTLY (PG) / ONLINE (Oracle)
- [ ] Data backfill in separate migration
- [ ] Tested on production data copy
- [ ] Rollback plan documented

## PostgreSQL

### Add Column

```sql
-- Safe: nullable, no lock
ALTER TABLE users ADD COLUMN avatar_url TEXT;

-- Safe: PG 11+ instant metadata-only, no rewrite
ALTER TABLE users ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

-- DANGEROUS: NOT NULL without default → full table rewrite + lock
-- ALTER TABLE users ADD COLUMN role TEXT NOT NULL;
```

### Add Index (No Downtime)

```sql
-- Non-blocking (cannot run inside transaction block)
CREATE INDEX CONCURRENTLY idx_users_email ON users (email);
```

### Rename Column — Expand-Contract

Never rename directly. Three-migration pattern:

```sql
-- Migration 1: add new column
ALTER TABLE users ADD COLUMN display_name TEXT;

-- Migration 2: backfill (separate data migration)
UPDATE users SET display_name = username WHERE display_name IS NULL;

-- Deploy app reading/writing BOTH columns, then:
-- Migration 3: drop old column
ALTER TABLE users DROP COLUMN username;
```

### Remove Column

1. Remove all code references → deploy
2. Drop column in next migration

### Batch Update (Large Tables)

```sql
DO $$
DECLARE
  batch_size INT := 10000;
  rows_updated INT;
BEGIN
  LOOP
    UPDATE users SET normalized_email = LOWER(email)
    WHERE id IN (
      SELECT id FROM users WHERE normalized_email IS NULL
      LIMIT batch_size FOR UPDATE SKIP LOCKED
    );
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
    COMMIT;
  END LOOP;
END $$;
```

## Oracle

### Add Column

```sql
-- Oracle 11g+: NOT NULL with DEFAULT is metadata-only (no rewrite)
ALTER TABLE users ADD (is_active NUMBER(1) DEFAULT 1 NOT NULL);
```

### Add Index (No Downtime)

```sql
CREATE INDEX idx_users_email ON users (email) ONLINE;
```

### Batch Update (PL/SQL)

```sql
DECLARE
  v_batch NUMBER := 10000;
  v_rows  NUMBER;
BEGIN
  LOOP
    UPDATE users SET normalized_email = LOWER(email)
    WHERE normalized_email IS NULL AND ROWNUM <= v_batch;
    v_rows := SQL%ROWCOUNT;
    COMMIT;
    EXIT WHEN v_rows = 0;
  END LOOP;
END;
/
```

## Django

```bash
python manage.py makemigrations          # Generate from model changes
python manage.py migrate                 # Apply
python manage.py showmigrations          # Status
python manage.py makemigrations --empty app_name -n desc  # Custom SQL
```

### Data Migration

```python
from django.db import migrations

def backfill(apps, schema_editor):
    User = apps.get_model("accounts", "User")
    batch = 5000
    qs = User.objects.filter(display_name="")
    while qs.exists():
        rows = list(qs[:batch])
        for u in rows:
            u.display_name = u.username
        User.objects.bulk_update(rows, ["display_name"], batch_size=batch)

class Migration(migrations.Migration):
    dependencies = [("accounts", "0015_add_display_name")]
    operations = [migrations.RunPython(backfill, migrations.RunPython.noop)]
```

### SeparateDatabaseAndState

Remove field from Django model without dropping DB column yet:

```python
migrations.SeparateDatabaseAndState(
    state_operations=[migrations.RemoveField(model_name="user", name="legacy")],
    database_operations=[],  # Drop in next migration
)
```

## Zero-Downtime Strategy (Expand-Contract)

| Phase        | Action                                                            |
| ------------ | ----------------------------------------------------------------- |
| **EXPAND**   | Add new column (nullable/default). App writes BOTH. Backfill data |
| **MIGRATE**  | App reads NEW, writes BOTH. Verify consistency                    |
| **CONTRACT** | App uses only NEW. Drop old in separate migration                 |

## Anti-Patterns

| Anti-Pattern                     | Risk                    | Fix                                 |
| -------------------------------- | ----------------------- | ----------------------------------- |
| Manual SQL in prod               | No audit trail          | Use migration files                 |
| Edit deployed migration          | Env drift               | Create new migration                |
| NOT NULL without default         | Table lock              | Nullable → backfill → constraint    |
| Inline index on large table      | Blocks writes           | CONCURRENTLY / ONLINE               |
| Schema + data in one migration   | Long txn, hard rollback | Separate migrations                 |
| Drop column before removing code | App errors              | Remove code first, drop next deploy |
