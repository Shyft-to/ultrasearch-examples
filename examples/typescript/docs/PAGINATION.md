# Pagination Guide

Learn how to efficiently handle large result sets using pagination tokens.

## Overview

UltraSearch queries can return thousands or even millions of results. Pagination allows you to retrieve results in manageable chunks, avoiding memory issues and timeout errors.

## How Pagination Works

### Basic Concept

1. **Initial Request**: Send query without `paginationToken`
2. **Get Results**: Receive first page of results + pagination token
3. **Next Page**: Use token in next request to get next page
4. **Repeat**: Continue until `paginationToken` is `null`

### Pagination Token Format

```
"slot:transactionIndex"
```

Example: `"394941095:1232"`
- `394941095` - Slot number
- `1232` - Transaction index within that slot

When `paginationToken` is `null`, you've reached the end of results.

## Use Cases

- 📊 **Data Export**: Export large datasets for analysis
- 🔄 **Backfilling**: Load historical data into databases
- 📈 **Analytics**: Process all transactions for reporting
- 🔍 **Comprehensive Search**: Ensure no transactions are missed

## Basic Pagination Example

```typescript
import axios from "axios";
import { SearchTransactionsRpcRequest } from "./types";

const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";

async function fetchAllTransactions() {
  let allTransactions = [];
  let paginationToken = null;
  let pageCount = 0;

  do {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const request: SearchTransactionsRpcRequest = {
      jsonrpc: "2.0",
      id: pageCount,
      method: "searchTransactions",
      params: {
        accountInclude: ["TokenProgram..."],
        fromBlock: 394940000,
        toBlock: 394945000,
        limit: 1000,
        paginationToken // undefined on first iteration, then set from response
      }
    };

    const response = await axios.post(RPC_URL, request);
    const { transactions, paginationToken: nextToken } = response.data.result;

    allTransactions.push(...transactions);
    paginationToken = nextToken;

    console.log(`  → Got ${transactions.length} transactions`);
    console.log(`  → Total: ${allTransactions.length}`);
    console.log(`  → More pages: ${nextToken !== null}\n`);

  } while (paginationToken !== null);

  console.log(`✅ Complete! Total: ${allTransactions.length} transactions`);
  return allTransactions;
}
```

## Response Structure

### With More Pages

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "transactions": [...], // Current page results
    "paginationToken": "394941095:1232" // Token for next page
  }
}
```

### Last Page

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "transactions": [...], // Final page results
    "paginationToken": null // No more results
  }
}
```

## Limits and Constraints

### Result Limits by Mode

| Mode | Max Limit | Default Limit |
|------|-----------|---------------|
| `signatures` | 1000 | 1000 |
| `full` | 100 | 100 |

### Important Notes

- Pagination tokens are **specific to query parameters**
- Don't mix tokens between different queries
- Tokens may expire after extended periods
- Always check if token is `null` before requesting next page

## Advanced Patterns

### 1. Progress Tracking

```typescript
async function fetchWithProgress() {
  let allTransactions = [];
  let paginationToken = null;
  let pageCount = 0;
  const startTime = Date.now();

  do {
    pageCount++;
    
    const response = await searchTransactions({
      accountInclude: ["..."],
      paginationToken,
      limit: 1000
    });

    const { transactions, paginationToken: nextToken } = response;
    allTransactions.push(...transactions);
    paginationToken = nextToken;

    // Progress indicators
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (allTransactions.length / elapsed).toFixed(0);
    
    console.log(`Page ${pageCount} | Total: ${allTransactions.length} | Rate: ${rate}/sec`);

  } while (paginationToken !== null);

  return allTransactions;
}
```

### 2. Batch Processing

```typescript
async function processByBatch(batchSize = 1000) {
  let paginationToken = null;
  let batchCount = 0;

  do {
    batchCount++;
    
    const response = await searchTransactions({
      accountInclude: ["..."],
      paginationToken,
      limit: batchSize
    });

    const { transactions, paginationToken: nextToken } = response;
    
    // Process this batch
    await processBatch(transactions, batchCount);
    
    paginationToken = nextToken;

    // Rate limiting
    await sleep(100); // 100ms delay between batches

  } while (paginationToken !== null);
}

async function processBatch(transactions, batchNumber) {
  console.log(`Processing batch ${batchNumber} (${transactions.length} txs)`);
  
  // Your processing logic here
  for (const tx of transactions) {
    // Analyze, store, transform, etc.
  }
  
  console.log(`✓ Batch ${batchNumber} complete`);
}
```

### 3. Resumable Downloads

```typescript
interface DownloadState {
  paginationToken: string | null;
  downloadedCount: number;
  lastBatchTime: number;
}

class ResumableDownloader {
  private state: DownloadState;
  
  constructor() {
    // Load state from file or database
    this.state = this.loadState() || {
      paginationToken: null,
      downloadedCount: 0,
      lastBatchTime: Date.now()
    };
  }

  async download() {
    while (true) {
      try {
        const response = await searchTransactions({
          accountInclude: ["..."],
          paginationToken: this.state.paginationToken,
          limit: 1000
        });

        const { transactions, paginationToken } = response;
        
        // Process batch
        await this.processBatch(transactions);
        
        // Update state
        this.state.paginationToken = paginationToken;
        this.state.downloadedCount += transactions.length;
        this.state.lastBatchTime = Date.now();
        
        // Save state for resumption
        this.saveState();

        // Check if done
        if (paginationToken === null) {
          console.log("✅ Download complete!");
          break;
        }

      } catch (error) {
        console.error("Error during download:", error);
        console.log("State saved. Resume by running again.");
        break;
      }
    }
  }

  private saveState() {
    // Save to file, database, etc.
    fs.writeFileSync('download-state.json', JSON.stringify(this.state));
  }

  private loadState(): DownloadState | null {
    try {
      return JSON.parse(fs.readFileSync('download-state.json', 'utf8'));
    } catch {
      return null;
    }
  }
}

// Usage
const downloader = new ResumableDownloader();
await downloader.download(); // Resumes from last position if interrupted
```

### 4. Parallel Pagination

```typescript
/**
 * Download multiple time ranges in parallel
 * Useful for very large historical queries
 */
async function parallelPagination() {
  const blockRanges = [
    { from: 394900000, to: 394920000 },
    { from: 394920000, to: 394940000 },
    { from: 394940000, to: 394960000 },
  ];

  // Download each range in parallel
  const results = await Promise.all(
    blockRanges.map(range => downloadRange(range))
  );

  // Combine results
  const allTransactions = results.flat();
  console.log(`Total transactions: ${allTransactions.length}`);
  
  return allTransactions;
}

async function downloadRange({ from, to }) {
  let allTransactions = [];
  let paginationToken = null;

  do {
    const response = await searchTransactions({
      accountInclude: ["..."],
      fromBlock: from,
      toBlock: to,
      paginationToken,
      limit: 1000
    });

    const { transactions, paginationToken: nextToken } = response;
    allTransactions.push(...transactions);
    paginationToken = nextToken;

  } while (paginationToken !== null);

  console.log(`Range ${from}-${to}: ${allTransactions.length} transactions`);
  return allTransactions;
}
```

## Error Handling

### Retry Logic

```typescript
async function fetchPageWithRetry(params, maxRetries = 3) {
  let retries = 0;

  while (retries < maxRetries) {
    try {
      const response = await searchTransactions(params);
      return response;
      
    } catch (error) {
      retries++;
      
      if (retries >= maxRetries) {
        throw new Error(`Failed after ${maxRetries} retries: ${error.message}`);
      }

      // Exponential backoff
      const delay = Math.pow(2, retries) * 1000;
      console.log(`Retry ${retries}/${maxRetries} after ${delay}ms...`);
      await sleep(delay);
    }
  }
}
```

### Rate Limit Handling

```typescript
async function fetchWithRateLimit(params) {
  try {
    return await searchTransactions(params);
    
  } catch (error) {
    if (error.response?.status === 429) {
      // Rate limited - wait and retry
      console.log("Rate limited. Waiting 60 seconds...");
      await sleep(60000);
      return fetchWithRateLimit(params); // Retry
    }
    throw error;
  }
}
```

## Performance Optimization

### 1. Batch Size Selection

```typescript
// For signatures mode (faster)
const SIGNATURES_BATCH = 1000; // Max allowed

// For full mode (slower but more data)
const FULL_BATCH = 100; // Max allowed

// Adjust based on needs
const batchSize = needFullDetails ? FULL_BATCH : SIGNATURES_BATCH;
```

### 2. Concurrent Processing

```typescript
import pLimit from 'p-limit';

async function optimizedPagination() {
  const limit = pLimit(5); // 5 concurrent page fetches
  let paginationToken = null;
  const pagePromises = [];

  // Fetch first few pages to get tokens
  for (let i = 0; i < 5; i++) {
    pagePromises.push(
      limit(() => fetchPage(paginationToken))
    );
    // Get token for next iteration
    // (This is a simplified example)
  }

  const results = await Promise.all(pagePromises);
  return results.flat();
}
```

### 3. Memory Management

```typescript
async function memoryEfficientPagination() {
  let paginationToken = null;
  let processedCount = 0;

  do {
    const response = await searchTransactions({
      accountInclude: ["..."],
      paginationToken,
      limit: 1000
    });

    const { transactions, paginationToken: nextToken } = response;

    // Process immediately instead of storing
    await processTransactions(transactions);
    processedCount += transactions.length;
    
    // Don't keep transactions in memory
    paginationToken = nextToken;

    console.log(`Processed ${processedCount} total transactions`);

  } while (paginationToken !== null);
}
```

## Common Patterns

### Stream to Database

```typescript
async function streamToDatabase(db) {
  let paginationToken = null;
  let insertedCount = 0;

  do {
    const response = await searchTransactions({
      accountInclude: ["..."],
      paginationToken,
      limit: 1000
    });

    const { transactions, paginationToken: nextToken } = response;

    // Batch insert to database
    await db.insertMany(transactions);
    insertedCount += transactions.length;
    
    paginationToken = nextToken;

    console.log(`Inserted ${insertedCount} transactions`);

  } while (paginationToken !== null);
}
```

### Export to CSV

```typescript
import fs from 'fs';

async function exportToCSV(filename) {
  const stream = fs.createWriteStream(filename);
  
  // Write header
  stream.write('signature,slot,blockTime\n');

  let paginationToken = null;
  let exportedCount = 0;

  do {
    const response = await searchTransactions({
      accountInclude: ["..."],
      paginationToken,
      limit: 1000
    });

    const { transactions, paginationToken: nextToken } = response;

    // Write rows
    transactions.forEach(tx => {
      stream.write(`${tx.signature},${tx.slot},${tx.blockTime}\n`);
    });

    exportedCount += transactions.length;
    paginationToken = nextToken;

    console.log(`Exported ${exportedCount} transactions`);

  } while (paginationToken !== null);

  stream.end();
  console.log(`✅ Export complete: ${filename}`);
}
```

## Best Practices

1. **Always Check for Null**: Don't assume more pages exist
2. **Preserve Query Parameters**: Keep all params consistent across pages
3. **Implement Timeouts**: Add request timeouts to prevent hanging
4. **Rate Limiting**: Add delays between requests
5. **Error Recovery**: Save progress and allow resumption
6. **Progress Tracking**: Show users download progress
7. **Memory Management**: Process data immediately, don't store all in memory

## Troubleshooting

**Q: Pagination token not working?**
- Ensure query parameters are identical across requests
- Check if token has expired (rare, but possible)
- Verify token format is correct

**Q: Getting duplicate results?**
- This shouldn't happen - pagination is consistent
- Report this as a bug if you encounter it

**Q: How long are tokens valid?**
- Tokens are typically valid for hours
- For long-running jobs, implement resumption logic

**Q: Can I skip pages?**
- No, pagination is sequential
- You must fetch pages in order

## Related Topics

- [Basic Search](BASIC_SEARCH.md) - Getting started
- [Block Range Queries](BLOCK_RANGE.md) - Historical data
- [API Reference](API.md) - Complete parameter docs

---

*Need help? Join our [Discord community](https://discord.com/invite/RXBmKSdVRe)*
