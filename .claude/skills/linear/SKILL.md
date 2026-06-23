---
name: linear
description: >-
  Read and write Linear (issues, comments, relations, projects, milestones)
  through repo-local GraphQL helpers authenticated with LINEAR_API_KEY. Use
  whenever a task needs to query or mutate Linear state from this repository.
---

# Linear

Use this skill whenever the agent needs to read or write Linear state from an
OpenSymphony-managed repository.

## Required auth

- `LINEAR_API_KEY` must be present in the environment.
- If it is missing, treat Linear access as a real blocker.
- `tracker.project_slug` stores Linear `Project.slugId`, not a display name.

## Primary path

Run the repo-local helper:

```bash
python3 .claude/skills/linear/scripts/linear_graphql.py \
  --query-file .claude/skills/linear/queries/viewer.graphql
```

Pass variables as inline JSON or a JSON file:

```bash
python3 .claude/skills/linear/scripts/linear_graphql.py \
  --query-file .claude/skills/linear/queries/issue_by_key.graphql \
  --variables '{"key":"COE-123"}'
```

## References

- Start with [references/using-the-helper.md](references/using-the-helper.md).
- For issue creation, updates, comments, relations, and PR-link work, open
  [references/issue-and-comment-operations.md](references/issue-and-comment-operations.md).
- For project overview/status updates, uploads, and introspection, open
  [references/project-and-advanced-operations.md](references/project-and-advanced-operations.md).

## Rules

- This repo uses GraphQL-only Linear access through the checked-in helper.
- Prefer query files under `.claude/skills/linear/queries/` over ad hoc inline
  GraphQL strings.
- Keep exactly one GraphQL operation per request.
- Use variables instead of string interpolation.
- Treat a top-level `errors` array as a failed Linear operation even if the
  HTTP request succeeds.
- Keep requested fields narrow and task-specific.
- When an unfamiliar mutation or input shape is needed, start with the
  introspection query files before guessing.
- Use the reference docs for exact variable shapes and example commands instead
  of copying large GraphQL documents inline.

## Common workflows

- Review feedback polling:
  - When a workflow asks for PR feedback, review polling, rework feedback, or a
    final merge-readiness sweep, read latest Linear issue comments first with
    `.claude/skills/linear/queries/issue_comments.graphql`.
  - Treat unresolved, actionable operator comments on the Linear issue as
    feedback even when the GitHub PR has no new review comments.
- Create an issue or sub-issue:
  - `.claude/skills/linear/queries/issue_create.graphql`
- Update an issue title, body, or metadata:
  - `.claude/skills/linear/queries/issue_update.graphql`
- Read issue comments:
  - `.claude/skills/linear/queries/issue_comments.graphql`
- Create a comment:
  - `.claude/skills/linear/queries/comment_create.graphql`
- Edit a comment:
  - `.claude/skills/linear/queries/comment_update.graphql`
- Move an issue to a new state:
  - `.claude/skills/linear/queries/issue_team_states.graphql`
  - `.claude/skills/linear/queries/issue_move_to_state.graphql`
- Attach a GitHub PR:
  - `.claude/skills/linear/queries/attachment_link_github_pr.graphql`
- Attach a plain URL:
  - `.claude/skills/linear/queries/attachment_link_url.graphql`
- Create an issue relation:
  - `.claude/skills/linear/queries/issue_relation_create.graphql`
- Read project planning state:
  - `.claude/skills/linear/queries/project_planning_state.graphql`
- Create or update a project milestone:
  - `.claude/skills/linear/queries/project_milestone_create.graphql`
  - `.claude/skills/linear/queries/project_milestone_update.graphql`
- Update project overview/content:
  - `.claude/skills/linear/queries/project_by_slug.graphql`
  - `.claude/skills/linear/queries/project_update_content.graphql`
- Create or update project status:
  - `.claude/skills/linear/queries/project_status_create.graphql`
  - `.claude/skills/linear/queries/project_status_update.graphql`
  - `.claude/skills/linear/queries/project_set_status.graphql`
- Upload a file for a comment:
  - `.claude/skills/linear/queries/file_upload.graphql`
  - upload the bytes to the returned `uploadUrl` with `Content-Type` matching
    the requested `contentType` plus every header returned by Linear
  - then create or update the comment with the returned `assetUrl`
- Inspect the schema:
  - `.claude/skills/linear/queries/introspect_mutations.graphql`
  - `.claude/skills/linear/queries/introspect_input_shape.graphql`
