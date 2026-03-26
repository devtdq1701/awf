#!/usr/bin/env python3
import os
import shutil
from pathlib import Path
import argparse

def install_workflows(target_dir=None):
    """Install standard workflows to the target directory."""
    if target_dir:
        target_path = Path(target_dir).resolve()
    else:
        # Default to current workspace's .agent/workflows
        target_path = Path.cwd() / ".agent" / "workflows"

    print(f"🚀 Installing workflows to: {target_path}")

    # Ensure target directory exists
    target_path.mkdir(parents=True, exist_ok=True)

    # Source directory (assets folder in the skill)
    script_dir = Path(__file__).resolve().parent
    skill_dir = script_dir.parent
    assets_dir = skill_dir / "assets"

    if not assets_dir.exists():
        print(f"❌ Error: Assets directory not found at {assets_dir}")
        return False

    # Copy files
    count = 0
    for item in assets_dir.glob("*.md"):
        if item.is_file():
            dest = target_path / item.name
            shutil.copy2(item, dest)
            print(f"  ✅ Installed: {item.name}")
            count += 1

    print(f"\n✨ Successfully installed {count} workflows!")
    print(f"👉 You can now use them via slash commands (e.g. /audit, /code)")
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Install standard workflows")
    parser.add_argument("--path", help="Target directory (default: .agent/workflows)")
    args = parser.parse_args()

    install_workflows(args.path)
