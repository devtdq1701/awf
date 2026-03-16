# Resilience Patterns (Hidden from User)

> Handle failures silently. User should not see retry/timeout internals.

## Auto-Retry

Transient errors (network, rate limit, file write): retry 3x with exponential backoff (1s → 2s → 4s). Still failing → notify user in plain language.

## Timeout Protection

| Workflow      | Timeout |
| ------------- | ------- |
| /code, /debug | 5 min   |
| /deploy       | 10 min  |
| Others        | 3 min   |

On timeout → "This is taking longer than expected. Continue?"

## Error Simplification

Always translate technical errors to plain language + emoji + suggested action. Never show raw stack traces to non-tech users.

## Fallback Menu

After multiple failures → numbered options:

1. Try a different approach
2. Skip and continue
3. /debug for deep analysis

## JSON Recovery

If brain.json/session.json corrupted → backup (.bak) → recreate from template → notify user.
