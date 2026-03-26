---
name: memory-manager
description: Quản lý MCP Memory Service (mcp-memory-service-lite) để lưu trữ và truy xuất thông tin giữa các sessions. Backend SQLite + ONNX semantic search. Sử dụng khi cần nhớ user preferences, project context, hoặc knowledge cần persist.
---

# Memory Manager

Hướng dẫn sử dụng mcp-memory-service-lite (SQLite + ONNX vector embeddings).

## Architecture

```
AI Agent → MCP Tools → SQLite DB + ONNX Vectors (384-dim)
                        ~/.local/share/mcp-memory/sqlite_vec.db
```

- **Storage**: SQLite WAL mode, 5ms reads, concurrent safe
- **Search**: Semantic search (hiểu nghĩa, không cần exact match)
- **Embeddings**: ONNX model → 384-dim vectors per memory
- **Install**: `~/.local/share/mcp-memory-service/` (Python venv)

## Core Concepts

### Memory

Đơn vị lưu trữ cơ bản:

- **content**: Nội dung text (Markdown)
- **tags**: Labels phân loại (`["project", "work"]`)
- **metadata**: Key-value metadata (`{"source": "session"}`)

### Semantic Search

Query được convert thành vector → so sánh khoảng cách với tất cả memories → trả về gần nhất.

- `"copy dữ liệu Vĩnh Long"` → tìm thấy `"VLG data migration"` ✅
- Không cần khớp chính xác từng chữ

## Memory Tools

| Tool                   | Mục đích                                   |
| ---------------------- | ------------------------------------------ |
| `store_memory`         | Lưu memory mới (content + tags + metadata) |
| `retrieve_memory`      | Tìm kiếm semantic (theo nghĩa)             |
| `search_by_tag`        | Tìm theo tags                              |
| `exact_match_retrieve` | Tìm exact match                            |
| `delete_memory`        | Xóa memory theo hash                       |
| `delete_by_tag`        | Xóa tất cả memories có tag                 |
| `get_memory_stats`     | Thống kê DB                                |

## Memory Workflow

### 1. Đầu mỗi session

```
1. retrieve_memory("<your_username> preferences") → User context
2. retrieve_memory("<current_project>") → Project context
```

### 2. Trong quá trình làm việc

Khi phát hiện thông tin quan trọng → lưu ngay:

```
store_memory(
  content: "# Project X\n- Uses Quarkus\n- PostgreSQL backend\n- Deploy on K8s",
  tags: ["project", "work"],
  metadata: {"date": "2026-02-18"}
)
```

### 3. Kết thúc session

Lưu session summary:

```
store_memory(
  content: "# Session 2026-02-18\n- Completed memory migration\n- Updated MCP config",
  tags: ["session", "2026-02-18"]
)
```

## Memory Categories

| Category          | Tags         | Ví dụ                    |
| ----------------- | ------------ | ------------------------ |
| **User Identity** | `user`       | name, role, timezone     |
| **Preferences**   | `preference` | coding style, tools      |
| **Projects**      | `project`    | tech stack, architecture |
| **Patterns**      | `pattern`    | workflows, conventions   |
| **Decisions**     | `decision`   | architectural choices    |
| **Knowledge**     | `knowledge`  | technical learnings      |
| **Gotchas**       | `gotcha`     | bugs, pitfalls found     |
| **Sessions**      | `session`    | work summaries           |

## Best Practices

1. **Markdown content** — Dùng headers, lists cho structure
2. **Meaningful tags** — Giúp filter nhanh (`search_by_tag`)
3. **One topic per memory** — Không mix nhiều chủ đề
4. **Include context** — Date, project name, source trong metadata
5. **Avoid duplicates** — `retrieve_memory` trước khi store
6. **Regular cleanup** — `delete_by_tag` cho data cũ không cần

## Migration Notes

- Migrated từ `@modelcontextprotocol/server-memory` (JSONL) ngày 2026-02-18
- Script: `~/.gemini/scripts/migrate_memory.py`
- Old backup: `~/.gemini/memory.jsonl.bak`
- 31 entities → 31 memories (+ 3 session memories)

## Reference

- [Memory Patterns](references/memory-patterns.md) — Common use cases
