#!/usr/bin/env python3
import shutil
from pathlib import Path
import argparse
import sys

def create_guide(tool_name, target_dir=None):
    """Create a new technical guide from the standard template."""
    if target_dir:
        target_path = Path(target_dir).resolve()
    else:
        target_path = Path.cwd()

    # Define filename
    filename = f"{tool_name.lower().replace(' ', '-')}-guide.md"
    dest_file = target_path / filename

    # Source template
    script_dir = Path(__file__).resolve().parent
    skill_dir = script_dir.parent
    template_path = skill_dir / "assets" / "template.md"

    if not template_path.exists():
        print(f"❌ Error: Template not found at {template_path}")
        return False

    # Read template
    try:
        content = template_path.read_text()
    except Exception as e:
        print(f"❌ Error reading template: {e}")
        return False

    # Customize title
    content = content.replace("[Tool Name]", tool_name)

    # Write to destination
    try:
        dest_file.write_text(content)
        print(f"✅ Created guide: {dest_file}")
        print(f"👉 Open the file and fill in the details for '{tool_name}'!")
        return True
    except Exception as e:
        print(f"❌ Error writing file: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a technical guide skeleton")
    parser.add_argument("tool_name", help="Name of the tool (e.g., 'Prometheus')")
    parser.add_argument("--path", help="Target directory (default: current dir)")
    args = parser.parse_args()

    create_guide(args.tool_name, args.path)
