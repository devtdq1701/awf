# GitHub CLI Replacement

> CRUD operations moved from MCP to `gh` CLI / `git` commands.
> MCP retained for: `get_file_contents`, `search_issues`, `search_pull_requests`, `search_repositories`, `pull_request_read`, `issue_read`, `get_me`.

## CLI Equivalents

| Disabled MCP Tool       | CLI Replacement                                                                                     |
| ----------------------- | --------------------------------------------------------------------------------------------------- |
| `create_branch`         | `gh api repos/{owner}/{repo}/git/refs -f ref=refs/heads/{branch} -f sha={from_sha}`                 |
| `create_or_update_file` | `gh api repos/{owner}/{repo}/contents/{path} -X PUT -f message="msg" -f content="$(base64 < file)"` |
| `create_pull_request`   | `gh pr create --title "X" --body "Y" --base main --head branch`                                     |
| `create_repository`     | `gh repo create name --public --description "desc"`                                                 |
| `list_issues`           | `gh issue list --state open --json number,title,url --limit 20`                                     |
| `list_pull_requests`    | `gh pr list --state open --json number,title,url --limit 20`                                        |
| `merge_pull_request`    | `gh pr merge NUMBER --squash --delete-branch`                                                       |
| `push_files`            | `git add . && git commit -m "msg" && git push`                                                      |
| `list_issue_types`      | `gh api orgs/{owner}/issue-types`                                                                   |

## When to Use What

| Need                                      | Use                                          |
| ----------------------------------------- | -------------------------------------------- |
| Read remote file (no clone)               | MCP `get_file_contents`                      |
| Search issues/PRs (complex query)         | MCP `search_issues` / `search_pull_requests` |
| Search repos across GitHub                | MCP `search_repositories`                    |
| PR details (diff, status, files, reviews) | MCP `pull_request_read`                      |
| Issue details (comments, labels)          | MCP `issue_read`                             |
| Create PR, branch, repo                   | `gh` CLI via `run_command`                   |
| List issues/PRs (simple)                  | `gh` CLI via `run_command`                   |
| Push/commit files                         | `git` commands via `run_command`             |
