# Quick Start Guide

Get up and running with UltraSearch in 5 minutes!

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- UltraSearch API key ([Get one here](https://shyft.to))

## Installation

```bash
# Clone the repository
git clone https://github.com/Shyft-to/ultrasearch-examples.git
cd ultrasearch-examples/examples/typescript

# Install dependencies
npm install
```

## Configuration

Open `src/index.ts` and update the API key:

```typescript
const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";
```

## Run Your First Example

```bash
npm run start
```

By default, this runs Example 4 which demonstrates:
- Filtering transactions by required accounts (AND logic)
- Searching within a block range
- Pagination support

## Try Other Examples

Open `src/index.ts` and uncomment different examples in the `main()` function:

```typescript
async function main() {
  // Example 1: Latest signatures (recommended for beginners)
  await fetchLatestSignatures();

  // Example 2: Full transaction details
  // await fetchLatestTransactions();

  // Example 3: Filter by specific accounts
  // await fetchPumpTransactionsWithinBlocks();

  // ... more examples
}
```

## What's Next?

1. **Read the documentation**
   - [API Reference](examples/typescript/docs/API.md) - Complete parameter docs
   - [Basic Search](examples/typescript/docs/BASIC_SEARCH.md) - Getting started
   - [TypeScript README](examples/typescript/README.md) - Detailed guide

2. **Explore use cases**
   - Real-time transaction monitoring
   - DeFi protocol tracking
   - Token transfer analysis
   - Historical data retrieval

3. **Join the community**
   - [Discord](https://discord.com/invite/RXBmKSdVRe) - Get help and share ideas
   - [GitHub Issues](https://github.com/Shyft-to/ultrasearch-examples/issues) - Report bugs
   - [𝕏](https://x.com/shyft_hq) - Stay updated

## Common Issues

**API key not working?**
- Make sure you copied it correctly
- Check if it's activated in your dashboard

**No results returned?**
- Verify account addresses are correct
- Check if block range is valid
- Try without filters first

**Rate limit errors?**
- Reduce request frequency
- Implement delays between requests
- Check your plan limits

## Need Help?

- 📖 [Full Documentation](README.md)
- 💬 [Discord Community](https://discord.com/invite/RXBmKSdVRe)
- 📧 Email: genesis@shyft.to

---

Happy coding! 🚀
