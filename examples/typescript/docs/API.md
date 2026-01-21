# UltraSearch API Reference

Complete reference for the UltraSearch RPC API `searchTransactions` method.

## Table of Contents

- [Overview](#overview)
- [Request Format](#request-format)
- [Parameters](#parameters)
- [Response Format](#response-format)
- [Examples](#examples)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

## Overview

The `searchTransactions` method is a powerful JSON-RPC endpoint for searching and filtering Solana blockchain transactions.

**Endpoint:** `https://rpc.shyft.to?api_key=YOUR_API_KEY`

**Method:** `POST`

**Content-Type:** `application/json`

## Request Format

```typescript
{
  "jsonrpc": "2.0",
  "id": number | string,
  "method": "searchTransactions",
  "params": SearchParams
}
```

### TypeScript Interface

```typescript
interface SearchTransactionsRpcRequest {
  jsonrpc: "2.0";
  id: number | string;
  method: "searchTransactions";
  params: SearchParams;
}
```

## Parameters

All parameters are optional. An empty `params` object returns the latest 1000 transaction signatures.

### `accountInclude`

**Type:** `string[]`  
**Optional:** Yes  
**Logic:** OR (match ANY)

Include transactions that involve **any** of the specified accounts.

```typescript
{
  accountInclude: [
    "AccountAddress1",
    "AccountAddress2"
  ]
}
```

**Use cases:**
- Track transactions for multiple wallets
- Monitor multiple token accounts
- Aggregate data from related accounts

---

### `accountExclude`

**Type:** `string[]`  
**Optional:** Yes  
**Logic:** Exclusion

Exclude transactions that involve any of the specified accounts.

```typescript
{
  accountExclude: [
    "VoteProgram111111111111111111111111111111111"
  ]
}
```

**Use cases:**
- Filter out vote transactions
- Exclude known spam accounts
- Remove specific programs from results

---

### `accountRequired`

**Type:** `string[]`  
**Optional:** Yes  
**Logic:** AND (match ALL)

Only include transactions where **all** specified accounts are involved.

```typescript
{
  accountRequired: [
    "USDC_Address",
    "USDT_Address",
    "DEX_Program"
  ]
}
```

**Use cases:**
- Find multi-token swaps
- Track complex DeFi operations
- Identify specific transaction patterns

---

### `fromBlock`

**Type:** `number`  
**Optional:** Yes  
**Default:** Recent blocks

Starting block number (inclusive) for the search range.

```typescript
{
  fromBlock: 394940000
}
```

**Notes:**
- Block numbers are Solana slot numbers
- Inclusive range (includes the specified block)
- Use with `toBlock` for historical queries

---

### `toBlock`

**Type:** `number`  
**Optional:** Yes  
**Default:** Recent blocks

Ending block number (inclusive) for the search range.

```typescript
{
  toBlock: 394941496
}
```

**Notes:**
- Must be greater than or equal to `fromBlock`
- Inclusive range (includes the specified block)

---

### `vote`

**Type:** `boolean`  
**Optional:** Yes

Filter vote transactions.

```typescript
{
  vote: false  // Exclude vote transactions
}
```

**Values:**
- `true`: Include only vote transactions
- `false`: Exclude vote transactions
- `undefined`: Include all transactions

---

### `failed`

**Type:** `boolean`  
**Optional:** Yes

Filter failed transactions.

```typescript
{
  failed: false  // Exclude failed transactions
}
```

**Values:**
- `true`: Include only failed transactions
- `false`: Exclude failed transactions
- `undefined`: Include all transactions

---

### `sort`

**Type:** `"ASC" | "DESC"`  
**Optional:** Yes  
**Default:** `"ASC"`

Sort order based on slot number (block number).

```typescript
enum SortOrder {
  ASC = "ASC",   // Oldest first
  DESC = "DESC"  // Newest first
}

{
  sort: SortOrder.DESC
}
```

**Use cases:**
- `ASC`: Historical analysis, backfilling data
- `DESC`: Real-time monitoring, latest events

---

### `paginationToken`

**Type:** `string`  
**Optional:** Yes  
**Format:** `"slot:transactionIndex"` (e.g., `"394941095:1232"`)

Token for fetching the next page of results.

```typescript
{
  paginationToken: "394941095:1232"
}
```

**Usage:**
1. Make initial request without token
2. Check `paginationToken` in response
3. Use token in next request for next page
4. Continue until `paginationToken` is `null`

**Notes:**
- `null` means no more results
- Token format: `slot:transactionIndex`
- Tokens are specific to query parameters

---

### `limit`

**Type:** `number`  
**Optional:** Yes  
**Default:** Depends on `transactionDetails`

Maximum number of results per request.

```typescript
{
  limit: 100
}
```

**Limits:**
- When `transactionDetails: "signatures"`: Max `1000`, default `1000`
- When `transactionDetails: "full"`: Max `100`, default `100`

---

### `transactionDetails`

**Type:** `"signatures" | "full"`  
**Optional:** Yes  
**Default:** `"signatures"`

Level of detail in the response.

```typescript
enum TransactionDetails {
  Signatures = "signatures",  // Fast, lightweight
  Full = "full"               // Complete transaction data
}

{
  transactionDetails: TransactionDetails.Full
}
```

**Comparison:**

| Feature | `signatures` | `full` |
|---------|-------------|---------|
| **Response Size** | Small (~100 bytes) | Large (~10KB+) |
| **Speed** | Very fast | Slower |
| **Max Limit** | 1000 | 100 |
| **Contains** | Signature, slot, block time | Complete transaction data |
| **Use Cases** | Signature lists, quick searches | Detailed analysis, instruction parsing |

---

## Response Format

### Success Response

```typescript
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": Transaction[],
    "paginationToken": string | null
  }
}
```

### Transaction Object (signatures mode)

```typescript
{
  "signature": "5J8...",
  "slot": 393898476,
  "transactionIndex": 7,
  "err": null,
  "memo": null,
  "blockTime": 1768573429,
  "confirmationStatus": "finalized"
}
```

### Transaction Object (full mode)

```typescript
{
  "blockTime": 1704067200,
  "slot": 394941095,
  "transactionIndex": 7,
  "transaction": {
    "message": {
      "accountKeys": [...],
      "recentBlockhash": "...",
      "instructions": [...]
    },
    "signatures": [...]
  },
  "meta": {
    "err": null,
    "fee": 5000,
    "preBalances": [...],
    "postBalances": [...],
    "logMessages": [...],
    "preTokenBalances": [...],
    "postTokenBalances": [...]
  },
  "version": 0
}
```

### Error Response

```typescript
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": number,
    "message": string
  }
}
```

---

## Examples

### Example 1: Latest Signatures

```typescript
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "searchTransactions",
  params: {}
};

// Returns latest 1000 signatures
```

### Example 2: Filter by Account (OR Logic)

```typescript
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "searchTransactions",
  params: {
    accountInclude: [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "11111111111111111111111111111111"
    ],
    limit: 100
  }
};

// Returns transactions involving EITHER account
```

### Example 3: Required Accounts (AND Logic)

```typescript
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "searchTransactions",
  params: {
    accountRequired: [
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB"  // USDT
    ],
    transactionDetails: "full",
    limit: 50
  }
};

// Returns only transactions involving BOTH USDC AND USDT
```

### Example 4: Block Range with Pagination

```typescript
// First request
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "searchTransactions",
  params: {
    fromBlock: 394940000,
    toBlock: 394950000,
    sort: "DESC",
    limit: 1000
  }
};

// Next page (use paginationToken from response)
const nextRequest = {
  jsonrpc: "2.0",
  id: 2,
  method: "searchTransactions",
  params: {
    fromBlock: 394940000,
    toBlock: 394950000,
    sort: "DESC",
    limit: 1000,
    paginationToken: "394945123:456"
  }
};
```

### Example 5: Complex Filter

```typescript
const request = {
  jsonrpc: "2.0",
  id: 1,
  method: "searchTransactions",
  params: {
    accountInclude: [
      "DEX_Program_Address"
    ],
    accountExclude: [
      "Known_Bot_Address"
    ],
    fromBlock: 394940000,
    toBlock: 394941000,
    failed: false,
    vote: false,
    transactionDetails: "full",
    sort: "ASC",
    limit: 100
  }
};

// Returns successful non-vote DEX transactions, excluding bot activity
```

---

## Error Handling

### Common Error Codes

| Code | Message | Resolution |
|------|---------|------------|
| `-32600` | Invalid Request | Check JSON format |
| `-32601` | Method not found | Verify method name |
| `-32602` | Invalid params | Validate parameter types |
| `-32603` | Internal error | Retry or contact support |
| `401` | Unauthorized | Check API key |
| `429` | Rate limit exceeded | Implement rate limiting |

### Error Handling Pattern

```typescript
try {
  const response = await axios.post(RPC_URL, request);
  
  if (response.data.error) {
    const { code, message } = response.data.error;
    console.error(`RPC Error [${code}]: ${message}`);
    
    if (code === 429) {
      // Rate limit - wait and retry
      await sleep(1000);
      return retryRequest(request);
    }
    
    throw new Error(message);
  }
  
  return response.data.result;
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.error('Network error:', error.message);
  } else {
    console.error('Unexpected error:', error);
  }
  throw error;
}
```

---

## Best Practices

### 1. Choose the Right Detail Level

```typescript
// ✅ Good: Use signatures for listing
const signatures = await search({ limit: 1000 });

// ✅ Good: Use full only when needed
const details = await search({ 
  transactionDetails: "full",
  limit: 10 
});

// ❌ Bad: Requesting full details for large datasets
const badRequest = await search({ 
  transactionDetails: "full",
  limit: 100,  // Will be slow
  fromBlock: 1,
  toBlock: 1000000  // Very large range
});
```

### 2. Use Appropriate Block Ranges

```typescript
// ✅ Good: Reasonable range
const recent = await search({
  fromBlock: currentSlot - 1000,
  toBlock: currentSlot
});

// ❌ Bad: Extremely large range
const badRange = await search({
  fromBlock: 1,
  toBlock: 999999999  // Too large
});
```

### 3. Implement Pagination Properly

```typescript
// ✅ Good: Proper pagination loop
async function fetchAllTransactions(params) {
  const allTxs = [];
  let paginationToken = null;
  
  do {
    const result = await search({ ...params, paginationToken });
    allTxs.push(...result.data);
    paginationToken = result.paginationToken;
  } while (paginationToken !== null);
  
  return allTxs;
}

// ❌ Bad: No pagination handling
const result = await search({ limit: 100 });
// Missing: Check for more results
```

### 4. Understand Filter Logic

```typescript
// accountInclude: OR logic (ANY match)
const orLogic = await search({
  accountInclude: ["A", "B", "C"]
  // Returns transactions with A OR B OR C
});

// accountRequired: AND logic (ALL match)
const andLogic = await search({
  accountRequired: ["A", "B", "C"]
  // Returns only transactions with A AND B AND C
});

// Combined filters
const combined = await search({
  accountInclude: ["A", "B"],    // Must have A OR B
  accountRequired: ["C"],        // Must have C
  accountExclude: ["D"]          // Must NOT have D
  // Returns: (A OR B) AND C AND NOT D
});
```

### 5. Cache and Rate Limit

```typescript
// ✅ Good: Implement caching
const cache = new Map();

async function searchWithCache(params) {
  const key = JSON.stringify(params);
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await search(params);
  cache.set(key, result);
  
  return result;
}

// ✅ Good: Rate limiting
import pLimit from 'p-limit';
const limit = pLimit(10);  // 10 concurrent max

const results = await Promise.all(
  queries.map(q => limit(() => search(q)))
);
```

### 6. Monitor Performance

```typescript
async function searchWithMetrics(params) {
  const start = Date.now();
  
  try {
    const result = await search(params);
    const duration = Date.now() - start;
    
    console.log(`Query took ${duration}ms`);
    console.log(`Returned ${result.data.length} results`);
    
    return result;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
}
```

---

## Rate Limits

Rate limits vary by subscription tier:

| Tier       	| Requests/Second 	|
|------------	|-----------------	|
| Build      	| 10              	|
| Grow       	| 20              	|
| Accelerate 	| 40              	|
| Dedicated  	| Custom          	|

**Tips:**
- Implement exponential backoff
- Use pagination tokens efficiently
- Cache frequently accessed data
- Batch requests when possible

---

## Additional Resources

- [Code Examples](../README.md)
- [Discord Community](https://discord.com/invite/RXBmKSdVRe)

---
