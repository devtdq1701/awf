---
name: context-minify
description: >-
  Minify source code before feeding to LLM context.
  Strips comments, docstrings, and empty lines to save ~40-60% tokens.
  Use when reading large files for understanding (not editing).
  Keywords: minify, context, token, save, compress, reduce, optimize.
version: 1.0.0
---

# Context Minify — Token Saver for Large Files

Giảm kích thước code trước khi đưa vào context LLM.
Strip comments, docstrings, empty lines — giữ nguyên logic.

## Khi Nào Dùng

- Agent cần **ĐỌC** file lớn (>200 dòng) để hiểu context, **KHÔNG cần edit**
- Đọc nhiều files cùng lúc để nắm kiến trúc
- Context đang gần đầy, cần tiết kiệm tokens

## Khi KHÔNG Dùng

- File cần edit (cần giữ nguyên line numbers)
- File config (YAML, JSON, TOML) — đã compact sẵn
- File <50 dòng — overhead không đáng

## Cách Dùng

### 1. Minify 1 file

```bash
python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <file>
```

### 2. Minify giữ comments (chỉ strip empty lines)

```bash
python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <file> --keep-comments
```

### 3. Minify nhiều files (scan thư mục)

```bash
python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <directory> --ext py,js,ts
```

### 4. Chỉ xem stats (không output code)

```bash
python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py <file> --stats-only
```

## Tích Hợp Workflow

Trong `/code`, `/debug`, `/refactor` khi cần đọc file lớn:

```
# Thay vì đọc nguyên file 500 dòng:
view_file src/services/order_service.py

# Dùng minify để tiết kiệm ~50% tokens:
run_command("python ~/.gemini/antigravity/skills/context-minify/scripts/minify.py src/services/order_service.py")
```

## Ngôn Ngữ Hỗ Trợ

| Ngôn ngữ      | Comment style          | Docstring |
| ------------- | ---------------------- | --------- |
| Python        | `#` + `"""..."""`      | ✅ Strip  |
| JS/TS/JSX/TSX | `//` + `/* */`         | ✅ Strip  |
| Java/C/C++    | `//` + `/* */`         | ✅ Strip  |
| CSS/SCSS      | `/* */`                | ✅ Strip  |
| Bash/Shell    | `#`                    | ✅ Strip  |
| Ruby          | `#` + `=begin...=end`  | ✅ Strip  |
| Go            | `//` + `/* */`         | ✅ Strip  |
| Rust          | `//` + `/* */` + `///` | ✅ Strip  |
| SQL           | `--` + `/* */`         | ✅ Strip  |
| HTML/XML      | `<!-- -->`             | ✅ Strip  |
| Markdown      | N/A                    | ❌ Skip   |
