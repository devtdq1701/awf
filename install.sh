#!/usr/bin/env bash
# AWF — Antigravity Workflow Framework Installer
# https://github.com/devtdq1701/awf
#
# Usage:
#   Global:      curl -fsSL https://raw.githubusercontent.com/devtdq1701/awf/main/install.sh | bash
#   Per-Project: curl -fsSL https://raw.githubusercontent.com/devtdq1701/awf/main/install.sh | bash -s -- --project
#
# Options:
#   --project     Install into current project directory instead of global
#   --no-symlink  Skip creating symlinks for other agent IDEs
#   --copy        Copy files instead of symlinking (for agent IDE dirs)

set -euo pipefail

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

info()  { printf "${BLUE}[INFO]${NC}  %s\n" "$1"; }
ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
err()   { printf "${RED}[ERR]${NC}   %s\n" "$1"; }

# ── Parse args ──
MODE="global"
CREATE_SYMLINKS=true
USE_COPY=false

for arg in "$@"; do
  case "$arg" in
    --project)     MODE="project" ;;
    --no-symlink)  CREATE_SYMLINKS=false ;;
    --copy)        USE_COPY=true ;;
    --help|-h)
      echo "AWF Installer"
      echo ""
      echo "Usage:"
      echo "  bash install.sh              # Global install (recommended)"
      echo "  bash install.sh --project    # Per-project install"
      echo ""
      echo "Options:"
      echo "  --no-symlink  Skip symlinks for other agent IDEs"
      echo "  --copy        Copy instead of symlink for agent dirs"
      exit 0
      ;;
    *)
      err "Unknown option: $arg"
      exit 1
      ;;
  esac
done

# ── Banner ──
printf "\n"
printf "${CYAN}${BOLD}"
printf "    ___  _      ______\n"
printf "   /   || | /| / / __/\n"
printf "  / /| || |/ |/ / _/\n"
printf " /_/ |_||__/|__/_/\n"
printf "${NC}\n"
printf " ${BOLD}Antigravity Workflow Framework${NC}\n"
printf " Transform AI into a Development Team\n\n"

# ── Clone ──
CLONE_DIR=$(mktemp -d)
trap "rm -rf '$CLONE_DIR'" EXIT

info "Cloning AWF repository..."
if ! git clone --depth 1 --quiet https://github.com/devtdq1701/awf.git "$CLONE_DIR" 2>/dev/null; then
  err "Failed to clone repository. Check your internet connection."
  exit 1
fi
ok "Repository cloned"

# ── Determine target directories ──
if [ "$MODE" = "global" ]; then
  # Gemini (primary)
  GEMINI_BASE="$HOME/.gemini/antigravity"
  WORKFLOWS_DIR="$GEMINI_BASE/global_workflows"
  SKILLS_DIR="$GEMINI_BASE/skills"
  SCHEMAS_DIR="$GEMINI_BASE/schemas"
  TEMPLATES_DIR="$GEMINI_BASE/templates"

  info "Installing globally to ~/.gemini/antigravity/"
else
  # Per-project
  GEMINI_BASE=".gemini"
  WORKFLOWS_DIR="$GEMINI_BASE/workflows"
  SKILLS_DIR="$GEMINI_BASE/skills"
  SCHEMAS_DIR="$GEMINI_BASE/schemas"
  TEMPLATES_DIR="$GEMINI_BASE/templates"

  info "Installing into current project: $(pwd)/.gemini/"
fi

# ── Install core files ──
info "Copying workflows, skills, schemas, templates..."
mkdir -p "$WORKFLOWS_DIR" "$SKILLS_DIR" "$SCHEMAS_DIR" "$TEMPLATES_DIR"

cp -r "$CLONE_DIR"/workflows/* "$WORKFLOWS_DIR/"
cp -r "$CLONE_DIR"/skills/* "$SKILLS_DIR/"
cp -r "$CLONE_DIR"/schemas/* "$SCHEMAS_DIR/"
cp -r "$CLONE_DIR"/templates/* "$TEMPLATES_DIR/"

ok "Core files installed"

# ── Count installed items ──
WF_COUNT=$(find "$WORKFLOWS_DIR" -maxdepth 1 -name "*.md" ! -name "README.md" | wc -l)
SK_COUNT=$(find "$SKILLS_DIR" -maxdepth 1 -type d | tail -n +2 | wc -l)
info "Installed ${WF_COUNT} workflows, ${SK_COUNT} skills"

# ── Create symlinks for multi-agent IDE compatibility ──
if [ "$CREATE_SYMLINKS" = true ]; then
  printf "\n"
  info "Setting up multi-agent IDE compatibility..."

  # Resolve absolute path for symlink targets
  if [ "$MODE" = "global" ]; then
    ABS_SKILLS=$(cd "$SKILLS_DIR" && pwd)
    ABS_WORKFLOWS=$(cd "$WORKFLOWS_DIR" && pwd)

    # Agent directories to symlink (user-level)
    AGENT_DIRS=(
      "$HOME/.agent"
      "$HOME/.agents"
    )

    for agent_dir in "${AGENT_DIRS[@]}"; do
      skills_target="$agent_dir/skills/awf"
      workflows_target="$agent_dir/workflows/awf"

      if [ "$USE_COPY" = true ]; then
        mkdir -p "$skills_target" "$workflows_target"
        cp -r "$ABS_SKILLS"/* "$skills_target/" 2>/dev/null || true
        cp -r "$ABS_WORKFLOWS"/* "$workflows_target/" 2>/dev/null || true
        ok "Copied to $agent_dir/"
      else
        # Skills symlink
        mkdir -p "$(dirname "$skills_target")"
        if [ -L "$skills_target" ]; then
          rm "$skills_target"
        fi
        if [ ! -e "$skills_target" ]; then
          ln -s "$ABS_SKILLS" "$skills_target"
          ok "Symlinked skills -> $agent_dir/skills/awf"
        else
          warn "Skipped $skills_target (already exists, not a symlink)"
        fi

        # Workflows symlink
        mkdir -p "$(dirname "$workflows_target")"
        if [ -L "$workflows_target" ]; then
          rm "$workflows_target"
        fi
        if [ ! -e "$workflows_target" ]; then
          ln -s "$ABS_WORKFLOWS" "$workflows_target"
          ok "Symlinked workflows -> $agent_dir/workflows/awf"
        else
          warn "Skipped $workflows_target (already exists, not a symlink)"
        fi
      fi
    done

  else
    # Per-project: symlink .agent/ and .agents/ to .gemini/
    ABS_SKILLS=$(cd "$SKILLS_DIR" && pwd)
    ABS_WORKFLOWS=$(cd "$WORKFLOWS_DIR" && pwd)

    AGENT_DIRS=(
      ".agent"
      ".agents"
    )

    for agent_dir in "${AGENT_DIRS[@]}"; do
      skills_target="$agent_dir/skills/awf"
      workflows_target="$agent_dir/workflows/awf"

      if [ "$USE_COPY" = true ]; then
        mkdir -p "$skills_target" "$workflows_target"
        cp -r "$ABS_SKILLS"/* "$skills_target/" 2>/dev/null || true
        cp -r "$ABS_WORKFLOWS"/* "$workflows_target/" 2>/dev/null || true
        ok "Copied to $agent_dir/"
      else
        mkdir -p "$(dirname "$skills_target")" "$(dirname "$workflows_target")"

        [ -L "$skills_target" ] && rm "$skills_target"
        [ ! -e "$skills_target" ] && ln -s "$ABS_SKILLS" "$skills_target" && ok "Symlinked -> $agent_dir/skills/awf"

        [ -L "$workflows_target" ] && rm "$workflows_target"
        [ ! -e "$workflows_target" ] && ln -s "$ABS_WORKFLOWS" "$workflows_target" && ok "Symlinked -> $agent_dir/workflows/awf"
      fi
    done
  fi
fi

# ── Summary ──
printf "\n"
printf "${GREEN}${BOLD}AWF installed successfully!${NC}\n\n"

if [ "$MODE" = "global" ]; then
  printf "  ${BOLD}Primary:${NC}   ~/.gemini/antigravity/\n"
  if [ "$CREATE_SYMLINKS" = true ]; then
    printf "  ${BOLD}Symlinks:${NC}  ~/.agent/skills/awf  -> primary\n"
    printf "             ~/.agents/skills/awf -> primary\n"
  fi
else
  printf "  ${BOLD}Primary:${NC}   .gemini/\n"
  if [ "$CREATE_SYMLINKS" = true ]; then
    printf "  ${BOLD}Symlinks:${NC}  .agent/skills/awf  -> primary\n"
    printf "             .agents/skills/awf -> primary\n"
  fi
fi

printf "\n"
printf "  ${CYAN}Get started:${NC} Type ${BOLD}/help${NC} in your AI assistant\n"
printf "  ${CYAN}Docs:${NC}        https://devtdq1701.github.io/awf/\n\n"
