# Basic Search - Getting Started

Learn how to fetch the latest transaction signatures from the Solana blockchain using UltraSearch.

## Overview

The simplest UltraSearch query returns the latest transaction signatures. This is perfect for monitoring recent blockchain activity or building real-time transaction feeds.

## Use Cases

- 🔔 Real-time transaction monitoring
- 📊 Recent activity dashboards
- 🔍 Quick transaction lookups
- 📱 Wallet notification systems
- 🎯 Network health monitoring

## Code Example

```typescript
import axios from "axios";
import { SearchTransactionsRpcRequest } from "./types/search-transactions-req";

const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";

async function fetchLatestSignatures() {
  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "searchTransactions",
    params: {} // Empty params returns latest signatures
  };

  try {
    const response = await axios.post(RPC_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.error) {
      console.error('API Error:', response.data.error);
      return;
    }

    const { transactions, paginationToken } = response.data.result;
    
    console.log(`Fetched ${transactions.length} signatures`);
    console.log('Latest signatures:', transactions.slice(0, 5));
    console.log('Has more results:', paginationToken !== null);

    return transactions;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// Run the example
fetchLatestSignatures();
```

## Request Parameters

When `params` is empty or not provided:

| Parameter | Value | Note |
|-----------|-------|------|
| `transactionDetails` | `"signatures"` | Default: only signatures |
| `limit` | `1000` | Default maximum |
| `sort` | `"ASC"` | Default: oldest first |

## Response Format

```typescript
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "transactions": [
      {
        "signature": "5J8nG7...",
        "slot": 394941095,
        "blockTime": 1704067200
      },
      // ... up to 1000 transactions
    ],
    "paginationToken": "394941095:1232" // or null if no more results
  }
}
```

### Response Fields

**Transaction Object (signatures mode):**

- `signature` (string): Transaction signature (unique identifier)
- `slot` (number): Slot number where transaction was processed
- `transactionIndex` (number): Transaction index at particular slot
- `err` (object): Transaction error if failed, otherwise null
- `memo` (string): Transaction memo if any, otherwise null
- `blockTime` (number): Unix timestamp of the block
- `confirmationStatus` (string): Solana transaction commitment 

**Pagination Token:**

- Format: `"slot:transactionIndex"` (e.g., `"394941095:1232"`)
- `null` when no more results are available
- Use this token in the next request to fetch the next page

## Step-by-Step Explanation

### 1. Set Up the Request

```typescript
const requestBody: SearchTransactionsRpcRequest = {
  jsonrpc: "2.0",              // JSON-RPC version
  id: 1,                        // Request identifier (can be any number/string)
  method: "searchTransactions", // API method name
  params: {}                    // Empty = latest signatures
};
```

### 2. Make the API Call

```typescript
const response = await axios.post(RPC_URL, requestBody, {
  headers: {
    "Content-Type": "application/json",
  },
});
```

### 3. Handle the Response

```typescript
// Check for errors
if (response.data.error) {
  console.error('API Error:', response.data.error);
  return;
}

// Extract results
const { transactions, paginationToken } = response.data.result;
```

### 4. Process the Signatures

```typescript
// Display results
transactions.forEach((tx, index) => {
  console.log(`${index + 1}. ${tx.signature}`);
  console.log(`   Slot: ${tx.slot}`);
  console.log(`   Time: ${new Date(tx.blockTime * 1000).toISOString()}`);
});
```

## Adding Pagination

To fetch more than 1000 signatures, use the pagination token:

```typescript
async function fetchAllRecentSignatures() {
  let allTransactions = [];
  let paginationToken = null;
  let pageCount = 0;

  do {
    const requestBody: SearchTransactionsRpcRequest = {
      jsonrpc: "2.0",
      id: ++pageCount,
      method: "searchTransactions",
      params: {
        paginationToken, // Add token from previous response
        limit: 1000
      }
    };

    const response = await axios.post(RPC_URL, requestBody, {
      headers: { "Content-Type": "application/json" }
    });

    const { transactions, paginationToken: nextToken } = response.data.result;
    
    allTransactions.push(...transactions);
    paginationToken = nextToken;

    console.log(`Page ${pageCount}: ${transactions.length} signatures`);
    console.log(`Total so far: ${allTransactions.length}`);

  } while (paginationToken !== null);

  console.log(`\nFetched ${allTransactions.length} signatures across ${pageCount} pages`);
  return allTransactions;
}
```

## Customizing the Query

### Limit Results

```typescript
params: {
  limit: 100  // Fetch only 100 signatures
}
```

### Change Sort Order

```typescript
import { SortOrder } from "./types/search-transactions-req";

params: {
  sort: SortOrder.DESC  // Newest first (default is ASC)
}
```

### Exclude Vote Transactions

```typescript
params: {
  vote: false  // Filter out vote transactions
}
```

### Exclude Failed Transactions

```typescript
params: {
  failed: false  // Filter out failed transactions
}
```

## Common Patterns

### Real-Time Monitoring

```typescript
async function monitorLatestTransactions() {
  let lastSignature = null;

  while (true) {
    const transactions = await fetchLatestSignatures();
    
    // Filter out transactions we've already seen
    const newTransactions = lastSignature
      ? transactions.filter(tx => tx.signature !== lastSignature)
      : transactions;

    if (newTransactions.length > 0) {
      console.log(`Found ${newTransactions.length} new transactions`);
      lastSignature = newTransactions[0].signature;
      
      // Process new transactions
      processTransactions(newTransactions);
    }

    // Wait 5 seconds before checking again
    await sleep(5000);
  }
}
```

### Batch Processing

```typescript
async function batchProcess() {
  const BATCH_SIZE = 1000;
  let processedCount = 0;
  let paginationToken = null;

  do {
    const { transactions, paginationToken: nextToken } = await fetchSignatures({
      limit: BATCH_SIZE,
      paginationToken
    });

    // Process batch
    await processBatch(transactions);
    processedCount += transactions.length;
    paginationToken = nextToken;

    console.log(`Processed ${processedCount} transactions`);
    
  } while (paginationToken !== null);
}
```

## Performance Tips

1. **Use appropriate limits**: Don't request more data than you need
2. **Implement rate limiting**: Avoid overwhelming the API
3. **Cache results**: Store signatures to avoid duplicate processing
4. **Use batch processing**: Process results in chunks for better performance
5. **Monitor pagination**: Always check for `paginationToken`

## Error Handling

```typescript
async function robustFetchSignatures() {
  const MAX_RETRIES = 3;
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const response = await axios.post(RPC_URL, requestBody);

      if (response.data.error) {
        const { code, message } = response.data.error;
        
        if (code === 429) {
          // Rate limit - wait and retry
          console.log('Rate limited, waiting...');
          await sleep(5000);
          retries++;
          continue;
        }
        
        throw new Error(`API Error: ${message}`);
      }

      return response.data.result;

    } catch (error) {
      retries++;
      if (retries >= MAX_RETRIES) {
        throw error;
      }
      
      console.log(`Attempt ${retries} failed, retrying...`);
      await sleep(1000 * retries); // Exponential backoff
    }
  }
}
```

## Next Steps

Now that you understand basic searches, explore:

- [Full Transaction Details](FULL_TRANSACTIONS.md) - Get complete transaction data
- [Account Filtering](ACCOUNT_FILTERING.md) - Filter by specific accounts
- [Block Range Queries](BLOCK_RANGE.md) - Search historical data
- [Pagination](PAGINATION.md) - Handle large datasets efficiently

## Related Resources

- [API Reference](API.md) - Complete parameter documentation
- [TypeScript Examples](../src/examples/) - More code examples
- [UltraSearch Docs](https://docs.shyft.to) - Official documentation

## Troubleshooting

**Q: I'm not getting any results**
- Verify your API key is valid
- Check network connectivity
- Ensure the API endpoint is correct

**Q: Results seem outdated**
- The blockchain may be slow
- Try sorting by DESC for newest first
- Check the `blockTime` field

**Q: Getting rate limit errors**
- Implement delays between requests
- Reduce request frequency
- Consider upgrading your plan

---

*Need help? Join our [Discord community](https://discord.com/invite/RXBmKSdVRe)*
