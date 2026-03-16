# Context Retrieval Priority (CRP)

> When retrieving info from past sessions, follow this priority order strictly.
> Do NOT skip to a lower priority before trying higher ones.

## Priority Order

1. **MCP Memory** (fastest, semantic) — `recall_memory` (by time), `retrieve_memory` (by content), `search_by_tag`
2. **Knowledge Items** — KI summaries in context + `view_file` on KI artifacts
3. **Conversation Summaries** — identify relevant conversation IDs
4. **Conversation Logs** — ONLY when above sources are insufficient (high token cost, may contain noise)

## Routing Table

| Query Type                           | Start From                       |
| ------------------------------------ | -------------------------------- |
| "What did I do today/yesterday?"     | Priority 1 (recall_memory)       |
| "Info about topic X?"                | Priority 1 → 2 (KI)              |
| "Specific conversation by ID/title?" | Priority 3 → 4 if details needed |
| "Deep knowledge about Y?"            | Priority 2 (KI) → 1              |
| "Code change history?"               | Priority 4 (git log) + 1         |

## Anti-Patterns

- Diving into conversation logs for "what did I do today?"
- Skipping memory service because you forgot it exists
- Using GitHub search when info is already in memory
