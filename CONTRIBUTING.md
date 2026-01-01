# Contributing to Threadless

Thank you for your interest in contributing to Threadless! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Principles

- Be respectful and inclusive
- Value constructive feedback
- Focus on what is best for the community
- Show empathy towards others
- Respect differing viewpoints and experiences

### Unacceptable Behavior

- Harassment or discrimination of any kind
- Trolling or inflammatory comments
- Publishing private information without permission
- Any conduct that would be inappropriate in a professional setting

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Git
- Basic knowledge of TypeScript
- Understanding of REST APIs

### Setting Up Development Environment

1. Fork the repository on GitHub

2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/Threadless.git
cd Threadless
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/GoCodeJones/Threadless.git
```

4. Install dependencies:
```bash
cd backend
npm install
```

5. Create environment file:
```bash
cp .env.example .env
```

6. Initialize database:
```bash
npm run seed
```

7. Start development server:
```bash
npm run dev
```

The API should now be running at `http://localhost:3000`

---

## Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

**Examples:**
```
feature/user-notifications
fix/connection-key-validation
docs/api-endpoints
refactor/trust-score-calculation
```

### Workflow Steps

1. Create a new branch from `main`:
```bash
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name
```

2. Make your changes and commit regularly

3. Keep your branch updated:
```bash
git fetch upstream
git rebase upstream/main
```

4. Push to your fork:
```bash
git push origin feature/your-feature-name
```

5. Open a Pull Request on GitHub

---

## Coding Standards

### TypeScript Guidelines

- Use TypeScript strict mode
- Always define types and interfaces
- Avoid `any` type when possible
- Use meaningful variable and function names
- Keep functions small and focused

**Example:**
```typescript
// Good
interface User {
  id: number;
  username: string;
  trustScore: number;
}

async function getUserById(id: number): Promise<User | undefined> {
  return await userModel.findById(id);
}

// Avoid
function getUser(id: any): any {
  return userModel.findById(id);
}
```

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Use async/await over promises
- Add comments for complex logic

### File Structure

- One class/controller per file
- Group related functionality
- Keep files under 300 lines when possible
- Use index.ts for barrel exports

### Naming Conventions

- **Files:** camelCase (e.g., `userController.ts`)
- **Classes:** PascalCase (e.g., `UserModel`)
- **Functions:** camelCase (e.g., `getUserById`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_CONNECTIONS`)
- **Interfaces:** PascalCase (e.g., `AuthRequest`)

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```
feat(auth): add JWT refresh token functionality

Implement refresh token mechanism to extend user sessions
without requiring re-authentication.

- Add refresh token to User model
- Create /auth/refresh endpoint
- Update JWT expiration handling
```

```
fix(posts): prevent duplicate posts on rapid submission

Add debouncing to post creation to prevent users from
accidentally creating duplicate posts when clicking submit
multiple times.

Fixes #123
```

```
docs(api): update authentication endpoint documentation

Add examples for error responses and clarify token expiration
behavior.
```

### Commit Best Practices

- Write clear, descriptive commit messages
- Keep commits atomic (one logical change per commit)
- Reference issues when applicable (e.g., `Fixes #123`)
- Use present tense ("add feature" not "added feature")
- First line should be 50 characters or less
- Separate subject from body with blank line

---

## Pull Request Process

### Before Submitting

1. Ensure your code follows the style guidelines
2. Update documentation if needed
3. Add or update tests for your changes
4. Run the test suite locally
5. Verify the application works as expected
6. Rebase on latest `main` branch

### PR Title Format

Use the same format as commit messages:

```
feat(scope): brief description
```

### PR Description Template

```markdown
## Description
Brief summary of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## How to Test
Steps to test the changes:
1. Step one
2. Step two
3. Expected result

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing

## Related Issues
Fixes #123
Related to #456
```

### Review Process

- At least one maintainer must approve
- All discussions must be resolved
- All tests must pass
- No merge conflicts

### After Approval

- Maintainers will merge using squash and merge
- Your branch can be deleted after merge
- Update your local repository

---

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Write tests for new features
- Update tests when modifying existing code
- Aim for meaningful test coverage
- Use descriptive test names

**Example:**
```typescript
describe('UserController', () => {
  describe('create', () => {
    it('should create user with valid credentials', async () => {
      // Test implementation
    });

    it('should reject duplicate usernames', async () => {
      // Test implementation
    });
  });
});
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying configuration
- Adding dependencies
- Changing architecture

### Documentation Files

- `README.md` - Project overview and quick start
- `API.md` - Complete API reference
- `ARCHITECTURE.md` - System design and structure
- Code comments - Explain complex logic
- JSDoc - Document public functions and classes

### Documentation Style

- Write clear, concise explanations
- Include code examples when helpful
- Use proper markdown formatting
- Keep documentation up to date with code changes

---

## Areas to Contribute

### Priority Areas

1. **Testing** - Unit and integration tests
2. **Documentation** - Tutorials, guides, examples
3. **Frontend** - Web interface implementation
4. **Security** - Audits, improvements
5. **Performance** - Optimization, profiling
6. **Features** - See roadmap in README

### Good First Issues

Look for issues labeled `good first issue` on GitHub. These are suitable for newcomers and provide a good introduction to the codebase.

### Feature Requests

Before implementing a new feature:
1. Check if an issue already exists
2. Create a new issue describing the feature
3. Wait for maintainer feedback
4. Discuss implementation approach
5. Submit PR after approval

---

## Getting Help

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Documentation** - Check README, API docs, and ARCHITECTURE docs

---

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)
- Project documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Threadless and helping build a free and open web!