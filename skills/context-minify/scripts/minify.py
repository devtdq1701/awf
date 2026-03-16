#!/usr/bin/env python3
"""
Context Minify — Reduce code size before feeding to LLM context.

Strips comments, docstrings, and empty lines while preserving logic.
Supports Python, JS/TS, Java, C/C++, Go, Rust, Bash, Ruby, SQL, CSS, HTML.

Usage:
    python minify.py <file_or_dir> [options]

Examples:
    python minify.py src/main.py                    # Minify single file
    python minify.py src/ --ext py,js               # Minify directory
    python minify.py src/main.py --keep-comments    # Keep comments
    python minify.py src/main.py --stats-only       # Stats only
"""

import argparse
import ast
import re
import sys
from pathlib import Path
from typing import Optional


# Language detection by file extension
LANG_MAP: dict[str, str] = {
    ".py": "python",
    ".js": "javascript", ".ts": "javascript", ".jsx": "javascript", ".tsx": "javascript",
    ".java": "c-style", ".c": "c-style", ".cpp": "c-style", ".cc": "c-style",
    ".h": "c-style", ".hpp": "c-style", ".cs": "c-style",
    ".go": "c-style", ".rs": "rust", ".swift": "c-style", ".kt": "c-style",
    ".css": "css", ".scss": "css", ".less": "css",
    ".sh": "hash", ".bash": "hash", ".zsh": "hash",
    ".rb": "ruby", ".pl": "hash", ".pm": "hash",
    ".sql": "sql",
    ".html": "html", ".xml": "html", ".svg": "html",
    ".yaml": "skip", ".yml": "skip", ".json": "skip", ".toml": "skip",
    ".md": "skip", ".txt": "skip", ".env": "skip",
}

# Extensions for directory scanning (default)
DEFAULT_EXTENSIONS = {"py", "js", "ts", "jsx", "tsx", "java", "go", "rs", "sh", "rb", "css", "sql", "c", "cpp", "html"}


def detect_language(path: Path) -> str:
    """Detect language from file extension."""
    return LANG_MAP.get(path.suffix.lower(), "unknown")


def strip_python_docstrings(source: str) -> str:
    """Remove Python docstrings using AST for safety (won't break string literals)."""
    try:
        tree = ast.parse(source)
    except SyntaxError:
        return source  # Can't parse → return as-is

    # Collect docstring line ranges
    lines = source.splitlines(keepends=True)
    remove_ranges: list[tuple[int, int]] = []

    for node in ast.walk(tree):
        # Docstrings are Expr nodes containing Constant(str) as first statement
        if isinstance(node, (ast.Module, ast.ClassDef, ast.FunctionDef, ast.AsyncFunctionDef)):
            if (node.body
                    and isinstance(node.body[0], ast.Expr)
                    and isinstance(node.body[0].value, ast.Constant)
                    and isinstance(node.body[0].value.value, str)):
                docstring_node = node.body[0]
                start = docstring_node.lineno - 1  # 0-indexed
                end = docstring_node.end_lineno  # exclusive
                remove_ranges.append((start, end))

    if not remove_ranges:
        return source

    # Sort by start line descending to remove from bottom up
    remove_ranges.sort(key=lambda r: r[0], reverse=True)
    for start, end in remove_ranges:
        del lines[start:end]

    return "".join(lines)


def strip_hash_comments(source: str) -> str:
    """Remove # comments (Python, Bash, Ruby, Perl). Preserves shebangs."""
    lines = source.splitlines()
    result = []
    for line in lines:
        stripped = line.strip()
        # Keep shebangs
        if stripped.startswith("#!"):
            result.append(line)
            continue
        # Full-line comment → skip
        if stripped.startswith("#"):
            continue
        # Inline comment — simple heuristic (not inside strings)
        # Only strip if # is preceded by whitespace and not inside quotes
        in_string = False
        quote_char = None
        clean = []
        for i, char in enumerate(line):
            if char in ('"', "'") and not in_string:
                in_string = True
                quote_char = char
                clean.append(char)
            elif char == quote_char and in_string:
                in_string = False
                quote_char = None
                clean.append(char)
            elif char == "#" and not in_string:
                # Strip from here
                break
            else:
                clean.append(char)
        result.append("".join(clean).rstrip())
    return "\n".join(result)


def strip_c_style_comments(source: str) -> str:
    """Remove // and /* */ comments. Safe for most C-like languages."""
    # Remove multi-line comments first
    source = re.sub(r"/\*.*?\*/", "", source, flags=re.DOTALL)
    # Remove single-line comments (not inside strings — basic heuristic)
    lines = source.splitlines()
    result = []
    for line in lines:
        # Simple: if // appears outside of quotes
        in_string = False
        quote_char = None
        clean = []
        i = 0
        while i < len(line):
            char = line[i]
            if char in ('"', "'", "`") and not in_string:
                in_string = True
                quote_char = char
                clean.append(char)
            elif char == quote_char and in_string:
                # Check escape
                if i > 0 and line[i - 1] == "\\":
                    clean.append(char)
                else:
                    in_string = False
                    quote_char = None
                    clean.append(char)
            elif char == "/" and i + 1 < len(line) and line[i + 1] == "/" and not in_string:
                break  # Rest of line is comment
            else:
                clean.append(char)
            i += 1
        result.append("".join(clean).rstrip())
    return "\n".join(result)


def strip_sql_comments(source: str) -> str:
    """Remove -- and /* */ comments from SQL."""
    source = re.sub(r"/\*.*?\*/", "", source, flags=re.DOTALL)
    lines = source.splitlines()
    result = []
    for line in lines:
        # Remove -- comments (not inside strings)
        idx = line.find("--")
        if idx >= 0:
            # Basic check: not inside quotes
            before = line[:idx]
            if before.count("'") % 2 == 0:
                line = before.rstrip()
        result.append(line)
    return "\n".join(result)


def strip_html_comments(source: str) -> str:
    """Remove <!-- --> comments from HTML/XML."""
    return re.sub(r"<!--.*?-->", "", source, flags=re.DOTALL)


def strip_ruby_block_comments(source: str) -> str:
    """Remove =begin...=end block comments from Ruby."""
    source = re.sub(r"^=begin\b.*?^=end\b", "", source, flags=re.DOTALL | re.MULTILINE)
    return strip_hash_comments(source)


def strip_empty_lines(source: str) -> str:
    """Remove empty lines and reduce multi-blanks to single."""
    lines = source.splitlines()
    result = []
    for line in lines:
        if line.strip():
            result.append(line)
    return "\n".join(result)


def minify_content(content: str, lang: str, keep_comments: bool = False) -> str:
    """Minify source code based on detected language."""
    if lang == "skip":
        return content

    result = content

    if not keep_comments:
        if lang == "python":
            result = strip_python_docstrings(result)
            result = strip_hash_comments(result)
        elif lang in ("javascript", "c-style", "css", "rust"):
            result = strip_c_style_comments(result)
        elif lang == "hash":
            result = strip_hash_comments(result)
        elif lang == "ruby":
            result = strip_ruby_block_comments(result)
        elif lang == "sql":
            result = strip_sql_comments(result)
        elif lang == "html":
            result = strip_html_comments(result)

    # Always strip empty lines for density
    result = strip_empty_lines(result)

    return result


def minify_file(
    file_path: Path,
    keep_comments: bool = False,
    stats_only: bool = False,
) -> Optional[dict]:
    """Minify a single file. Returns stats dict."""
    if not file_path.exists():
        print(f"❌ File not found: {file_path}", file=sys.stderr)
        return None

    lang = detect_language(file_path)
    if lang == "skip":
        return None
    if lang == "unknown":
        return None

    try:
        content = file_path.read_text(encoding="utf-8")
    except (UnicodeDecodeError, PermissionError) as exc:
        print(f"⚠️ Cannot read {file_path}: {exc}", file=sys.stderr)
        return None

    original_len = len(content)
    original_lines = content.count("\n") + 1

    if original_len == 0:
        return None

    minified = minify_content(content, lang, keep_comments)
    new_len = len(minified)
    new_lines = minified.count("\n") + 1
    saved = original_len - new_len
    pct = (saved / original_len) * 100 if original_len > 0 else 0

    stats = {
        "file": str(file_path),
        "lang": lang,
        "original_chars": original_len,
        "minified_chars": new_len,
        "original_lines": original_lines,
        "minified_lines": new_lines,
        "saved_pct": pct,
    }

    if stats_only:
        print(f"📉 {file_path.name}: {original_lines} → {new_lines} lines "
              f"({original_len:,} → {new_len:,} chars, saved {pct:.0f}%)")
    else:
        print(f"📉 {file_path.name}: {original_lines} → {new_lines} lines (saved {pct:.0f}%)")
        print("─" * 60)
        print(minified)
        print("─" * 60)

    return stats


def minify_directory(
    dir_path: Path,
    extensions: set[str],
    keep_comments: bool = False,
    stats_only: bool = True,  # Default stats-only for directories
) -> list[dict]:
    """Minify all matching files in a directory."""
    all_stats = []

    for ext in extensions:
        for file_path in sorted(dir_path.rglob(f"*.{ext}")):
            # Skip hidden dirs, node_modules, __pycache__, .git
            parts = file_path.parts
            if any(p.startswith(".") or p in ("node_modules", "__pycache__", "venv", ".venv") for p in parts):
                continue

            stats = minify_file(file_path, keep_comments, stats_only)
            if stats:
                all_stats.append(stats)

    return all_stats


def print_summary(all_stats: list[dict]) -> None:
    """Print summary table for directory scan."""
    if not all_stats:
        print("📭 No files processed.")
        return

    total_orig = sum(s["original_chars"] for s in all_stats)
    total_new = sum(s["minified_chars"] for s in all_stats)
    total_saved = total_orig - total_new
    total_pct = (total_saved / total_orig) * 100 if total_orig > 0 else 0

    print("\n" + "═" * 60)
    print(f"📊 SUMMARY: {len(all_stats)} files")
    print(f"   Original:  {total_orig:>10,} chars")
    print(f"   Minified:  {total_new:>10,} chars")
    print(f"   Saved:     {total_saved:>10,} chars ({total_pct:.0f}%)")
    print("═" * 60)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Context Minify — Reduce code for LLM context",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s src/main.py                    Minify single file
  %(prog)s src/ --ext py,js               Scan directory
  %(prog)s src/main.py --keep-comments    Keep comments, strip whitespace
  %(prog)s src/main.py --stats-only       Show stats only
        """,
    )
    parser.add_argument("path", help="File or directory to minify")
    parser.add_argument("--keep-comments", action="store_true", help="Keep comments (only strip empty lines)")
    parser.add_argument("--stats-only", action="store_true", help="Show stats without printing code")
    parser.add_argument("--ext", help="File extensions for directory scan (comma-separated, e.g. py,js,ts)")

    args = parser.parse_args()
    target = Path(args.path)

    if not target.exists():
        print(f"❌ Path not found: {target}", file=sys.stderr)
        sys.exit(1)

    if target.is_file():
        stats = minify_file(target, args.keep_comments, args.stats_only)
        if stats is None:
            print(f"⚠️ Skipped (unsupported or empty): {target}", file=sys.stderr)
            sys.exit(1)
    elif target.is_dir():
        extensions = set(args.ext.split(",")) if args.ext else DEFAULT_EXTENSIONS
        all_stats = minify_directory(target, extensions, args.keep_comments, stats_only=True)
        print_summary(all_stats)
    else:
        print(f"❌ Not a file or directory: {target}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
