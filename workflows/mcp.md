---
description: Manage MCP Servers (List, Enable, Disable) using mcp_manager.py
---

# MCP Server Management Workflow

1. List current server status
   // turbo
   python3 ~/.gemini/antigravity/scripts/mcp_manager.py list

2. Ask user for action
   Ask the user which server they want to enable or disable.
   Example input: "notebooklm-mcp on" or "context7 off".
   If they are done, stop.

3. Execute change
   Run the script with the user's requested arguments.
   Example: `python3 ~/.gemini/antigravity/scripts/mcp_manager.py notebooklm-mcp on`

4. Verify
   // turbo
   python3 ~/.gemini/antigravity/scripts/mcp_manager.py list
