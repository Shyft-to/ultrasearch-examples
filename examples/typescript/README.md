# TypeScript Examples

This directory contains TypeScript examples for the UltraSearch RPC API.

## 📋 Prerequisites

- Node.js 16 or higher
- npm or yarn
- TypeScript knowledge
- Solana blockchain basics

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Configuration

1. Update the `RPC_URL` in `src/index.ts` with your API key:

```typescript
const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";
```

2. Run the examples:

```bash
npm run start
```

## 🎯 Available Examples

### 1. Basic Search (`fetchLatestSignatures`)

Fetch the latest 1000 transaction signatures:

```typescript
const response = await searchTransactions({
  // Empty params returns latest signatures
});
```

**Use cases:**
- Recent blockchain activity monitoring
- Transaction feed for wallets
- Latest network events

### 2. Full Transaction Details (`fetchLatestTransactions`)

Get complete transaction data including instructions and logs:

```typescript
const response = await searchTransactions({
  transactionDetails: TransactionDetails.Full,
  limit: 100 // Max 100 for full details
});
```

**Use cases:**
- Detailed transaction analysis
- Audit logs
- Smart contract interaction tracking

### 3. Account Filtering (`fetchPumpTransactionsWithingBlocks`)

Filter transactions by specific accounts within a block range:

```typescript
const response = await searchTransactions({
  accountInclude: [
    "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA",
    "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P"
  ],
  fromBlock: 394940000,
  toBlock: 394941496,
  transactionDetails: TransactionDetails.Full,
  limit: 100
});
```

**Use cases:**
- DeFi protocol tracking (e.g., Pump.fun)
- Specific program monitoring
- Multi-account transaction analysis

### 4. Required Accounts + Pagination (`fetchSignaturesWhereAllTheseTokensInvolved`)

Find transactions where ALL specified accounts are involved:

```typescript
const response = await searchTransactions({
  accountRequired: [
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
    "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
    "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn"  // Pump.fun
  ],
  fromBlock: 394935000,
  toBlock: 394941496,
  sort: SortOrder.DESC,
  limit: 10,
  paginationToken: "394941095:1232" // For next page
});
```

**Use cases:**
- Multi-token swap tracking
- Complex DeFi operations
- Cross-protocol transaction analysis

## 📖 Documentation

Each example has detailed documentation in the `docs/` directory:

- [API Reference](docs/API.md) - Complete API documentation
- [Basic Search](docs/BASIC_SEARCH.md) - Getting started guide
- [Full Transactions](docs/FULL_TRANSACTIONS.md) - Detailed transaction data
- [Account Filtering](docs/ACCOUNT_FILTERING.md) - Filter by accounts
- [Block Range Queries](docs/BLOCK_RANGE.md) - Historical data retrieval
- [Pagination](docs/PAGINATION.md) - Handling large datasets
- [Advanced Filtering](docs/ADVANCED_FILTERING.md) - Complex queries

## 🏗️ Project can be build using this API call

- Token Transfer Tracker
- DeFi Transaction Dashboard
- Monitoring Pump.fun Trading Activity

## 🔧 Type Definitions

### Core Types

```typescript
// Transaction detail levels
enum TransactionDetails {
  Signatures = "signatures", // Only signatures (fast, default)
  Full = "full"              // Complete transaction data (detailed)
}

// Sorting options
enum SortOrder {
  ASC = "ASC",   // Ascending by slot (oldest first)
  DESC = "DESC"  // Descending by slot (newest first, default)
}

// Search parameters
interface SearchParams {
  accountInclude?: string[];      // Include txs with ANY of these accounts
  accountExclude?: string[];      // Exclude txs with these accounts
  accountRequired?: string[];     // Only txs with ALL these accounts
  fromBlock?: number;             // Start block (inclusive) — must pair with toBlock
  toBlock?: number;               // End block (inclusive) — must pair with fromBlock
  vote?: boolean;                 // Filter vote transactions
  failed?: boolean;               // Include/exclude failed txs
  sort?: SortOrder;               // Sort order
  paginationToken?: string;       // For fetching next page
  limit?: number;                 // Results per page
  transactionDetails?: TransactionDetails; // Detail level
}
```

## 🎨 Common Patterns

### Error Handling

```typescript
try {
  const response = await axios.post(RPC_URL, requestBody);
  if (response.data.error) {
    console.error('RPC Error:', response.data.error);
    return;
  }
  console.log(response.data.result);
} catch (error) {
  console.error('Request failed:', error);
}
```

### Pagination Loop

```typescript
let paginationToken: string | null = null;
const allTransactions = [];

do {
  const response = await searchTransactions({
    accountInclude: ["some-account"],
    paginationToken,
    limit: 1000
  });
  
  allTransactions.push(...response.result.data);
  paginationToken = response.result.paginationToken;
} while (paginationToken !== null);
```

### Rate Limiting

```typescript
import pLimit from 'p-limit';

const limit = pLimit(10); // 10 concurrent requests max

const promises = accounts.map(account =>
  limit(() => searchTransactions({ accountInclude: [account] }))
);

const results = await Promise.all(promises);
```

## ⚠️ Best Practices

1. **Use Appropriate Detail Levels**
   - Use `signatures` for most queries (faster, higher limits)
   - Use `full` only when you need complete transaction data

2. **Optimize Block Ranges**
   - Keep block ranges reasonable (avoid very large ranges)
   - Use specific ranges when possible
   - `fromBlock` and `toBlock` must **both** be specified or **both** omitted — providing only one is an error
   - When both are omitted the API defaults to a 5000-block window:
     - **No `paginationToken`, `DESC`** → last 5000 blocks
     - **No `paginationToken`, `ASC`** → first indexed block → +5000
     - **With `paginationToken`, `DESC`** → `paginationToken` slot − 5000 → slot
     - **With `paginationToken`, `ASC`** → `paginationToken` slot → slot + 5000

3. **Handle Pagination**
   - Always check for `paginationToken` in responses
   - Implement pagination for queries that might return many results

4. **Account Filtering Logic**
   - `accountInclude`: OR logic (any match)
   - `accountRequired`: AND logic (all must match)
   - `accountExclude`: Exclusion filter

5. **Rate Limiting**
   - Implement rate limiting for production applications
   - Cache results when appropriate

## 🧪 Testing

```bash
# Run all examples
npm run start

# Run specific example (modify index.ts)
npm run start

# Lint code
npm run lint

# Type check
npm run type-check
```

## 📦 Dependencies

- `axios`: HTTP client for API requests
- `typescript`: TypeScript compiler
- `@types/node`: Node.js type definitions

## 🔗 Related Resources

- [UltraSearch API Documentation](https://docs.shyft.to)
- [Solana Documentation](https://docs.solana.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 💡 Tips

- Start with simple queries and gradually add filters
- Use TypeScript's autocomplete for parameter discovery
- Check response `paginationToken` for large datasets
- Monitor your API usage in the dashboard
- Join our Discord for community support

## 🐛 Troubleshooting

**Issue: API key invalid**
- Verify your API key in the URL
- Check if your subscription is active

**Issue: Rate limit exceeded**
- Implement rate limiting in your code
- Upgrade your plan for higher limits

**Issue: Empty results**
- Verify account addresses are correct
- Check if block range contains transactions
- Ensure filters aren't too restrictive

---

Need help? Join our [Discord community](https://discord.com/invite/RXBmKSdVRe) or check the [main README](../../README.md).
