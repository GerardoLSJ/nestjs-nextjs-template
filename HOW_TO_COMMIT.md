# How to Commit

This project uses [Conventional Commits](https://www.conventionalcommits.org/) enforced by [commitlint](https://commitlint.js.org/).

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Required)

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (white-space, formatting, etc)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the name of the module/area affected:

- `api` - Backend API changes
- `web` - Frontend web app changes
- `auth` - Authentication module
- `users` - Users module
- `config` - Configuration changes
- `deps` - Dependency updates

### Subject (Required)

- Use imperative, present tense: "add" not "added" nor "adds"
- Don't capitalize first letter
- No period (.) at the end
- Maximum 100 characters

### Body (Optional)

- Use imperative, present tense
- Explain what and why vs. how
- Can include multiple paragraphs
- Use bullet points with `-` or `*`

### Footer (Optional)

- Reference issues: `Closes #123` or `Fixes #456`
- Breaking changes: `BREAKING CHANGE: description`

## Examples

### Simple Commit

```bash
git commit -m "feat(auth): add JWT token refresh endpoint"
```

### Commit with Body

```bash
git commit -m "fix(api): resolve CORS issue for localhost development

- Updated CORS configuration to allow localhost:3000
- Added credentials support for cookie-based auth
- Tested with both development and production builds"
```

### Commit with Breaking Change

```bash
git commit -m "feat(auth)!: migrate to RS256 JWT signing

BREAKING CHANGE: JWT tokens now use RS256 instead of HS256.
All existing tokens will be invalidated and users must re-authenticate."
```

### Complex Commit with Multiple Sections

```bash
git commit -m "$(cat <<'EOF'
feat: complete Phase 1.2 Users Module Backend

Implement comprehensive user management system with CRUD operations
and role-based access control.

## Changes
- UserService with full CRUD operations
- UserController with REST endpoints
- Role-based authorization guards
- User profile update validation
- Comprehensive unit and E2E tests

## Technical Decisions
- Soft delete pattern for user deactivation
- Password changes require current password verification
- Email uniqueness enforced at database level

Closes #45

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

## Common Mistakes to Avoid

### ❌ Wrong: Empty or missing type

```bash
git commit -m "add user settings"
```

### ✅ Correct:

```bash
git commit -m "feat: add user settings page"
```

### ❌ Wrong: Past tense

```bash
git commit -m "feat: added user authentication"
```

### ✅ Correct:

```bash
git commit -m "feat: add user authentication"
```

### ❌ Wrong: Capitalized subject

```bash
git commit -m "feat: Add JWT authentication"
```

### ✅ Correct:

```bash
git commit -m "feat: add JWT authentication"
```

### ❌ Wrong: Period at end

```bash
git commit -m "fix: resolve login bug."
```

### ✅ Correct:

```bash
git commit -m "fix: resolve login bug"
```

## Using Heredoc for Multi-line Commits

For complex commits with multiple sections, use heredoc syntax:

```bash
git commit -m "$(cat <<'EOF'
type(scope): subject line

Detailed explanation of what changed and why.

## Section 1
- Point 1
- Point 2

## Section 2
- Point 3
- Point 4

Additional notes or references.
EOF
)"
```

**Important**:

- Use `<<'EOF'` (with quotes) to prevent variable expansion
- Close with matching `EOF` followed by `)`
- Ensure proper formatting and spacing

## Git Workflow

### 1. Stage Your Changes

```bash
# Stage specific files
git add file1.ts file2.ts

# Stage all changes
git add .
```

### 2. Commit with Proper Message

```bash
# Simple commit
git commit -m "feat(auth): add login endpoint"

# Complex commit with heredoc
git commit -m "$(cat <<'EOF'
feat: add user profile management

- Profile update endpoint
- Avatar upload support
- Email change verification

Closes #123
EOF
)"
```

### 3. If Commitlint Fails

The error message will tell you what's wrong:

```
✖   subject may not be empty [subject-empty]
✖   type may not be empty [type-empty]
```

Fix your commit message format and try again.

### 4. Amending the Last Commit

If you need to fix the last commit message:

```bash
git commit --amend -m "new commit message"
```

## Pre-commit Hooks

This project uses pre-commit hooks that will:

1. Run linting on staged files
2. Format code automatically
3. Validate commit messages with commitlint

If the commit fails, the hooks will show you what went wrong. Fix the issues and commit again.

## References

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Commitlint Documentation](https://commitlint.js.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
