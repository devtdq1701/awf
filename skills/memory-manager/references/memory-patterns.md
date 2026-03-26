# Memory Patterns

Common patterns cho việc sử dụng mcp-memory-service-lite hiệu quả.

## Pattern 1: User Profile

```
store_memory(
  content: "# your_username
Type: user

## Info
- Full name: Your Name
- GitHub: your-github
- Timezone: UTC+7
- Role: Developer
- Language: Vietnamese for docs, English for code",
  tags: ["user", "profile"]
)
```

## Pattern 2: Project Context

```
store_memory(
  content: "# Data Migration Project
- Bash script for copying MinIO → FTP
- 17,000+ paths from source list
- Rclone with parallel workers
- CSV tracking: copy_status.csv, check_status.csv
- Dashboard: --status command",
  tags: ["project", "migration"],
  metadata: {"updated": "2026-02-18"}
)
```

## Pattern 3: Technical Knowledge

```
store_memory(
  content: "# Rclone Stats Gotchas
- --stats 0 suppresses ALL stats including final summary
- Use --stats 1s minimum for log parsing
- Transferred: line has TWO formats (bytes vs files)
- --log-file is essential for parallel workers",
  tags: ["gotcha", "rclone"]
)
```

## Pattern 4: Decision Log

```
store_memory(
  content: "# Decision: Memory Backend Migration
Date: 2026-02-18
Choice: mcp-memory-service-lite (SQLite + ONNX)
Reason: Semantic search, 5ms reads, tag-based filtering
Alternatives: mcp-memory-sqlite (drop-in but no semantic), keep JSONL
Trade-off: 805MB install, different API, Python dependency",
  tags: ["decision", "mcp", "memory"]
)
```

## Pattern 5: Session Summary

```
store_memory(
  content: "# Session 2026-02-18
## Done
- Migrated memory server JSONL → SQLite
- Installed mcp-memory-service-lite v8.76.0
- Updated mcp_config.json
- Updated memory-manager skill

## Issues
- Lite version has no Web Dashboard
- Hash embeddings (reduced quality without ONNX model)",
  tags: ["session", "2026-02-18"]
)
```

## Query Patterns

### Tìm user profile

```
retrieve_memory("<your_username> user preferences")
```

### Tìm project context

```
retrieve_memory("data migration rclone")
```

### Tìm theo tag

```
search_by_tag("project")
search_by_tag("gotcha")
search_by_tag("decision")
```

### Tìm session gần đây

```
search_by_tag("session")
retrieve_memory("session 2026-02-18")
```

### Tìm technical knowledge

```
retrieve_memory("Elasticsearch security setup")
retrieve_memory("PowerShell gotchas Windows")
```
