# Bash Scripting Standards

## 1. Safety & Robustness

### Strict Mode

Luôn bắt đầu script với:

```bash
#!/usr/bin/env bash
set -euo pipefail
```

- `-e`: Exit ngay khi có command fail
- `-u`: Exit khi dùng biến chưa defined
- `-o pipefail`: Return exit code của command fail cuối cùng trong pipe

### Error Handling

- Check exit codes cho critical commands
- Dùng `trap` để cleanup resources

```bash
cleanup() {
    rm -f "${TEMP_FILE}"
}
trap cleanup EXIT
```

## 2. Style & Formatting

### Variables

- **Local variables**: Dùng `local` trong functions
- **Constants**: UPPER_CASE (e.g., `MAX_RETRIES=3`)
- **Naming**: snake_case (e.g., `user_name`)
- **Quoting**: Luôn quote variables để tránh word splitting
  - ✅ `rm "$FILE"`
  - ❌ `rm $FILE`

### Conditionals

- Ưu tiên `[[ ]]` hơn `[ ]`
- Sử dụng `if`, `then`, `else` rõ ràng

```bash
if [[ "${1:-}" == "debug" ]]; then
    set -x
fi
```

## 3. Functions

- Định nghĩa rõ ràng, không dùng từ khóa `function` (deprecated style)

```bash
my_function() {
    local param1="${1:-}"
    # ...
}
```

## 4. Output

- Dùng functions cho logging

```bash
log_info() { echo "INFO: $*"; }
log_error() { echo "ERROR: $*" >&2; }
```

- Print to stderr cho errors/logs, stdout cho actual data

## 5. Tools

- Sử dụng **ShellCheck** để static analysis
