# Contributing to UltraSearch Examples

Thank you for your interest in contributing! This document provides guidelines for contributing to the UltraSearch Examples repository.

## 🎯 Ways to Contribute

- **Add new examples**: Share useful patterns and use cases
- **Improve documentation**: Fix typos, clarify explanations, add details
- **Report bugs**: Help us identify issues in examples
- **Suggest features**: Propose new examples or improvements
- **Review PRs**: Provide feedback on open pull requests

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- Git
- GitHub account
- Familiarity with TypeScript and Solana

### Setup

1. **Fork the repository**

```bash
# Click "Fork" on GitHub, then:
git clone https://github.com/Shyft-to/ultrasearch-examples.git
cd ultrasearch-examples
```

2. **Install dependencies**

```bash
cd examples/typescript
npm install
```

3. **Create a branch**

```bash
git checkout -b feature/your-feature-name
```

## 📝 Contribution Guidelines

### Code Style

- Use TypeScript with strict type checking
- Follow existing code formatting
- Use meaningful variable names
- Add comments for complex logic
- Include JSDoc comments for functions

**Example:**

```typescript
/**
 * Fetches transactions for a specific token within a block range
 * @param tokenAddress - The SPL token mint address
 * @param fromBlock - Starting block number
 * @param toBlock - Ending block number
 * @returns Array of transaction signatures
 */
async function fetchTokenTransactions(
  tokenAddress: string,
  fromBlock: number,
  toBlock: number
): Promise<string[]> {
  // Implementation
}
```

### Documentation

- Update README.md when adding new examples
- Create detailed documentation in `docs/` for complex examples
- Include use cases and real-world applications
- Add code comments for clarity
- Provide complete, runnable examples

### Examples

When adding a new example:

1. **Create a descriptive file name**
   - ✅ Good: `fetch-nft-transfers.ts`
   - ❌ Bad: `example3.ts`

2. **Include a header comment**

```typescript
/**
 * Example: Tracking NFT Transfers
 * 
 * This example demonstrates how to monitor NFT transfers on Solana
 * by filtering for Metaplex token metadata program interactions.
 * 
 * Use cases:
 * - NFT marketplace activity tracking
 * - Collection floor price monitoring
 * - Wallet NFT portfolio updates
 */
```

3. **Add type safety**

```typescript
// ✅ Good: Fully typed
interface NFTTransfer {
  signature: string;
  mint: string;
  from: string;
  to: string;
  timestamp: number;
}

async function trackNFTTransfers(): Promise<NFTTransfer[]> {
  // Implementation
}

// ❌ Bad: No types
async function trackNFTTransfers() {
  return await fetch(/* ... */);
}
```

4. **Handle errors properly**

```typescript
// ✅ Good: Proper error handling
try {
  const result = await searchTransactions(params);
  return result.data;
} catch (error) {
  console.error('Failed to fetch transactions:', error);
  throw new Error('Transaction search failed');
}

// ❌ Bad: No error handling
const result = await searchTransactions(params);
return result.data;
```

5. **Document the example**

Create a corresponding markdown file in `docs/`:

```markdown
# NFT Transfer Tracking

## Overview
This example shows how to track NFT transfers...

## Prerequisites
- Understanding of Solana NFTs
- Metaplex token metadata program knowledge

## Usage
\`\`\`typescript
// Example code
\`\`\`

## Explanation
Step-by-step breakdown...

## Use Cases
- Marketplace activity
- Portfolio tracking
...
```

### Commit Messages

Use clear, descriptive commit messages:

```bash
# ✅ Good
git commit -m "Add example for tracking NFT transfers"
git commit -m "Fix typo in API documentation"
git commit -m "Update pagination example with error handling"

# ❌ Bad
git commit -m "update"
git commit -m "fix"
git commit -m "changes"
```

**Format:**

```
<type>: <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature or example
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**

```
feat: Add DeFi transaction monitoring example

This example demonstrates how to monitor DeFi protocols
by tracking transactions across multiple DEX programs.

Includes:
- Real-time swap tracking
- Liquidity pool monitoring
- Multi-protocol support

Closes #42
```

## 🔍 Pull Request Process

1. **Update your branch**

```bash
git fetch origin
git rebase origin/main
```

2. **Test your changes**

```bash
npm run test
npm run lint
npm run type-check
```

3. **Push to your fork**

```bash
git push origin feature/your-feature-name
```

4. **Create a Pull Request**

- Go to the original repository on GitHub
- Click "New Pull Request"
- Select your fork and branch
- Fill out the PR template

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New example
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactoring

## Testing
How you tested the changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] Examples are runnable
- [ ] No breaking changes
```

## 📋 Example Checklist

Before submitting an example:

- [ ] Code is well-commented
- [ ] TypeScript types are complete
- [ ] Error handling is implemented
- [ ] Example is runnable without modification
- [ ] Documentation file created in `docs/`
- [ ] Use cases are clearly explained
- [ ] Real-world application is demonstrated
- [ ] API key is configurable
- [ ] No hardcoded sensitive data
- [ ] README.md updated with link to example

## 🐛 Reporting Bugs

### Before Reporting

- Check existing issues
- Verify it's not a configuration problem
- Test with the latest code

### Bug Report Template

```markdown
**Description**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Run example X
2. With parameters Y
3. See error Z

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- Node.js version:
- OS:
- Package versions:

**Additional Context**
Any other relevant information
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature valuable?

**Proposed Implementation**
How could this be implemented?

**Examples**
Code examples or mockups

**Alternatives**
Other approaches you've considered
```

## 📖 Documentation Standards

### README Structure

1. **Title and Description**: Clear, SEO-friendly
2. **Table of Contents**: For easy navigation
3. **Prerequisites**: What users need to know
4. **Installation**: Step-by-step setup
5. **Usage**: How to run examples
6. **Examples**: Code snippets with explanations
7. **API Reference**: Link to detailed docs
8. **Contributing**: Link to this guide
9. **License**: MIT License info

### Code Documentation

```typescript
/**
 * Searches for transactions involving specific accounts
 * 
 * @param accounts - Array of account addresses to search for
 * @param options - Optional search parameters
 * @param options.fromBlock - Starting block number
 * @param options.toBlock - Ending block number
 * @param options.limit - Maximum results to return
 * 
 * @returns Promise resolving to array of transactions
 * 
 * @throws {Error} If API request fails
 * 
 * @example
 * ```typescript
 * const txs = await searchByAccounts(
 *   ['address1', 'address2'],
 *   { fromBlock: 100000, limit: 50 }
 * );
 * ```
 */
```

## 🧪 Testing

While we don't have automated tests yet, manually verify:

1. **Code runs without errors**
2. **Output matches expectations**
3. **API calls succeed**
4. **Error cases are handled**
5. **Documentation is accurate**

## 🎨 Style Guide

### TypeScript

- Use `const` over `let` when possible
- Prefer interfaces over types for objects
- Use enum for related constants
- Avoid `any` type
- Use async/await over promises

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `search-transactions.ts`)
- **Functions**: `camelCase` (e.g., `fetchLatestTransactions`)
- **Types/Interfaces**: `PascalCase` (e.g., `SearchParams`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `RPC_URL`)

### File Organization

```
examples/typescript/
├── src/
│   ├── examples/           # Individual examples
│   │   ├── basic-search.ts
│   │   └── nft-tracking.ts
│   ├── types/             # Shared type definitions
│   │   └── index.ts
│   ├── utils/             # Utility functions
│   │   ├── rpc-client.ts
│   │   └── formatters.ts
│   └── index.ts           # Main entry point
└── docs/                  # Documentation
    ├── API.md
    └── examples/
        └── nft-tracking.md
```

## ⚖️ License

By contributing, you agree that your contributions will be licensed under the MIT License.

## 🤝 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the community
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discriminatory comments
- Personal attacks
- Publishing others' private information
- Unprofessional conduct

## 📞 Getting Help

- **Discord**: [Join our community](https://discord.com/invite/RXBmKSdVRe)
- **GitHub Issues**: For bugs and features
- **Discussions**: For questions and ideas
- **Email**: genesis@shyft.to

## 🙏 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

## 📚 Resources

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Solana Documentation](https://docs.solana.com/)
- [UltraSearch API Docs](https://docs.shyft.to/)
- [GitHub Flow Guide](https://guides.github.com/introduction/flow/)

---

Thank you for contributing to UltraSearch Examples! Your efforts help the entire Solana developer community. 🚀
