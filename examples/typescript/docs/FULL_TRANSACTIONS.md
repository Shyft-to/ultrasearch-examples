# Full Transaction Details

Learn how to retrieve complete transaction data including instructions, logs, account changes, and metadata.

## Overview

While the basic search returns only transaction signatures, the **full transaction mode** provides comprehensive data about each transaction, including all instructions executed, logs generated, account balance changes, and execution metadata.

## Use Cases

- 🔍 **Detailed Transaction Analysis**: Examine every aspect of a transaction
- 📊 **Audit Logs**: Track all changes and events in transactions
- 🏦 **Balance Tracking**: Monitor token and SOL balance changes
- 🔧 **Smart Contract Debugging**: Analyze program logs and errors
- 📈 **DeFi Analytics**: Parse swap details, liquidity changes
- 🎯 **Compliance & Reporting**: Generate detailed transaction reports

## Basic Example

```typescript
import axios from "axios";
import {
  SearchTransactionsRpcRequest,
  TransactionDetails,
} from "./types/search-transactions-req";

const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";

async function fetchLatestTransactions() {
  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "searchTransactions",
    params: {
      transactionDetails: TransactionDetails.Full,
      limit: 10 // Max 100 for full mode
    }
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

    const { transactions } = response.data.result;
    
    transactions.forEach((tx: any) => {
      console.log('\n=== Transaction ===');
      console.log('Signature:', tx.signature);
      console.log('Slot:', tx.slot);
      console.log('Status:', tx.meta.err ? 'Failed' : 'Success');
      console.log('Fee:', tx.meta.fee, 'lamports');
      console.log('Instructions:', tx.transaction.message.instructions.length);
      console.log('Accounts:', tx.transaction.message.accountKeys.length);
      console.log('Logs:', tx.meta.logMessages?.length || 0);
    });

    return transactions;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

## Full Transaction Structure

### Transaction Object

```typescript
{
  signature: "5J8nG7kL...",
  slot: 394941095,
  blockTime: 1704067200,
  
  transaction: {
    message: {
      accountKeys: [...],        // All accounts involved
      recentBlockhash: "...",    // Recent blockhash used
      instructions: [...]        // All instructions executed
    },
    signatures: [...]            // Transaction signatures
  },
  
  meta: {
    err: null,                   // Error if failed, null if success
    fee: 5000,                   // Fee in lamports
    preBalances: [...],          // SOL balances before
    postBalances: [...],         // SOL balances after
    preTokenBalances: [...],     // Token balances before
    postTokenBalances: [...],    // Token balances after
    logMessages: [...],          // Program logs
    innerInstructions: [...],    // CPI instructions
    rewards: [...],              // Staking rewards
    loadedAddresses: {...}       // Address lookup tables
  }
}
```

## Key Fields Explained

### 1. Basic Information

```typescript
// Transaction identifier
signature: "5J8nG7kL..." // Unique transaction signature

// Block information
slot: 394941095          // Slot number where tx was included
blockTime: 1704067200    // Unix timestamp
```

### 2. Transaction Message

```typescript
transaction: {
  message: {
    // All accounts involved in the transaction
    accountKeys: [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "11111111111111111111111111111111",
      // ... more accounts
    ],
    
    // Recent blockhash for transaction validity
    recentBlockhash: "9xqhFgVxU...",
    
    // Instructions executed in order
    instructions: [
      {
        programIdIndex: 0,      // Index into accountKeys
        accounts: [1, 2, 3],    // Account indices
        data: "3Bxs4..."         // Instruction data (base58)
      }
    ]
  }
}
```

### 3. Execution Metadata

```typescript
meta: {
  // Transaction status
  err: null,                    // null = success, object = error details
  
  // Fee information
  fee: 5000,                    // Fee paid in lamports
  
  // SOL balance changes
  preBalances: [1000000, 500000, ...],   // Before execution
  postBalances: [995000, 500000, ...],   // After execution
  
  // Token balance changes
  preTokenBalances: [
    {
      accountIndex: 2,
      mint: "EPjFWdd5...",
      uiTokenAmount: {
        amount: "1000000",
        decimals: 6,
        uiAmount: 1.0
      }
    }
  ],
  postTokenBalances: [...],
  
  // Program logs
  logMessages: [
    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA invoke [1]",
    "Program log: Instruction: Transfer",
    "Program TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA success"
  ],
  
  // Cross-Program Invocations (CPI)
  innerInstructions: [...]
}
```

## Practical Examples

### Example 1: Analyze Token Transfers

```typescript
async function analyzeTokenTransfer() {
  const response = await searchTransactions({
    // Search params to find the transaction
    transactionDetails: TransactionDetails.Full,
    limit: 1
  });

  const tx = response.data[0];
  
  // Compare pre and post token balances
  const tokenChanges = tx.meta.postTokenBalances.map((post: any, index: number) => {
    const pre = tx.meta.preTokenBalances.find(
      (p: any) => p.accountIndex === post.accountIndex
    );
    
    if (!pre) return null;
    
    const preAmount = parseFloat(pre.uiTokenAmount.amount);
    const postAmount = parseFloat(post.uiTokenAmount.amount);
    const change = postAmount - preAmount;
    
    return {
      mint: post.mint,
      account: tx.transaction.message.accountKeys[post.accountIndex],
      change,
      decimals: post.uiTokenAmount.decimals
    };
  }).filter(Boolean);
  
  console.log('Token Changes:');
  tokenChanges.forEach(change => {
    const displayAmount = change.change / Math.pow(10, change.decimals);
    console.log(`  ${change.mint}: ${displayAmount > 0 ? '+' : ''}${displayAmount}`);
  });
}
```

### Example 2: Extract Program Logs

```typescript
async function extractProgramLogs() {
  const response = await searchTransactions({
    transactionDetails: TransactionDetails.Full,
    limit: 1
  });

  const tx = response.data[0];
  
  // Parse logs for specific patterns
  const logs = tx.meta.logMessages || [];
  
  // Find program invocations
  const programInvocations = logs.filter(log => 
    log.includes('invoke [1]')
  );
  
  // Find errors
  const errors = logs.filter(log => 
    log.toLowerCase().includes('error') || 
    log.toLowerCase().includes('failed')
  );
  
  console.log('Program Invocations:', programInvocations);
  console.log('Errors:', errors);
  
  return { programInvocations, errors };
}
```

### Example 3: Calculate SOL Balance Changes

```typescript
async function calculateBalanceChanges() {
  const response = await searchTransactions({
    transactionDetails: TransactionDetails.Full,
    limit: 1
  });

  const tx = response.data[0];
  const accountKeys = tx.transaction.message.accountKeys;
  
  const changes = tx.meta.preBalances.map((preBalance: number, index: number) => {
    const postBalance = tx.meta.postBalances[index];
    const change = postBalance - preBalance;
    
    return {
      account: accountKeys[index],
      preBalance: preBalance / 1e9,  // Convert lamports to SOL
      postBalance: postBalance / 1e9,
      change: change / 1e9
    };
  }).filter(c => c.change !== 0);
  
  console.log('\nSOL Balance Changes:');
  changes.forEach(change => {
    console.log(`${change.account}:`);
    console.log(`  Before: ${change.preBalance} SOL`);
    console.log(`  After: ${change.postBalance} SOL`);
    console.log(`  Change: ${change.change > 0 ? '+' : ''}${change.change} SOL\n`);
  });
  
  return changes;
}
```

### Example 4: Parse DEX Swap Details

```typescript
async function parseDEXSwap() {
  const response = await searchTransactions({
    accountInclude: ["DEX_PROGRAM_ADDRESS"],
    transactionDetails: TransactionDetails.Full,
    limit: 1
  });

  const tx = response.data[0];
  
  // Get token balance changes
  const tokenChanges = {};
  
  tx.meta.postTokenBalances.forEach((post: any) => {
    const pre = tx.meta.preTokenBalances.find(
      (p: any) => p.accountIndex === post.accountIndex
    );
    
    if (pre) {
      const mint = post.mint;
      const change = parseFloat(post.uiTokenAmount.amount) - 
                     parseFloat(pre.uiTokenAmount.amount);
      
      if (change !== 0) {
        tokenChanges[mint] = {
          change,
          decimals: post.uiTokenAmount.decimals
        };
      }
    }
  });
  
  console.log('Swap Details:');
  Object.entries(tokenChanges).forEach(([mint, data]: [string, any]) => {
    const displayAmount = data.change / Math.pow(10, data.decimals);
    console.log(`  ${mint}: ${displayAmount > 0 ? '+' : ''}${displayAmount}`);
  });
}
```

## Limits and Performance

### Important Constraints

| Parameter | Value | Note |
|-----------|-------|------|
| **Max Limit** | 100 | Per request in full mode |
| **Default Limit** | 100 | When not specified |
| **Response Size** | ~250-350 KB | Per transaction (varies) |
| **Performance** | Slower | Compared to signatures mode |

### Performance Comparison

```typescript
// Signatures mode: Fast, lightweight
params: {
  transactionDetails: TransactionDetails.Signatures,
  limit: 1000  // Can fetch 1000 at once
}
// Response time: ~100-300ms

// Full mode: Slower, comprehensive
params: {
  transactionDetails: TransactionDetails.Full,
  limit: 100   // Max 100 at once
}
// Response time: ~500-2000ms
```

## Best Practices

### 1. Use Full Mode Selectively

```typescript
// ❌ Bad: Getting full details when signatures are enough
const allTxs = await searchTransactions({
  transactionDetails: TransactionDetails.Full,
  limit: 100
});

// ✅ Good: Get signatures first, then fetch full details for specific ones
const signatures = await searchTransactions({
  transactionDetails: TransactionDetails.Signatures,
  limit: 1000
});

const interestingSignatures = filterInteresting(signatures);

const fullDetails = await Promise.all(
  interestingSignatures.map(sig => 
    getTransactionDetails(sig)
  )
);
```

### 2. Batch Processing

```typescript
async function processBatches() {
  let paginationToken = null;
  
  do {
    // Fetch batch
    const response = await searchTransactions({
      transactionDetails: TransactionDetails.Full,
      limit: 100, // Max for full mode
      paginationToken
    });
    
    // Process immediately
    await processBatch(response.data);
    
    paginationToken = response.paginationToken;
    
    // Rate limiting
    await sleep(200);
    
  } while (paginationToken !== null);
}
```

### 3. Error Handling

```typescript
async function robustFetch() {
  try {
    const response = await searchTransactions({
      transactionDetails: TransactionDetails.Full,
      limit: 10
    });
    
    response.data.forEach(tx => {
      // Always check for errors
      if (tx.meta.err) {
        console.error(`Transaction ${tx.signature} failed:`, tx.meta.err);
        return; // Skip failed transactions
      }
      
      // Process successful transaction
      processTransaction(tx);
    });
    
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw error;
  }
}
```

### 4. Memory Management

```typescript
// ❌ Bad: Loading all transactions into memory
const allTxs = [];
let token = null;
do {
  const response = await search({ transactionDetails: "full", paginationToken: token });
  allTxs.push(...response.data); // Memory keeps growing!
  token = response.paginationToken;
} while (token);

// ✅ Good: Process and discard
let token = null;
do {
  const response = await search({ transactionDetails: "full", paginationToken: token });
  
  // Process immediately
  await processAndStore(response.data);
  
  // Don't keep in memory
  token = response.paginationToken;
} while (token);
```

## Common Patterns

### Stream to Database

```typescript
async function streamToDatabase() {
  let paginationToken = null;
  let processedCount = 0;
  
  do {
    const response = await searchTransactions({
      accountInclude: ["PROGRAM_ADDRESS"],
      transactionDetails: TransactionDetails.Full,
      limit: 100,
      paginationToken
    });
    
    // Extract relevant data
    const records = response.data.map(tx => ({
      signature: tx.signature,
      slot: tx.slot,
      blockTime: tx.blockTime,
      success: tx.meta.err === null,
      fee: tx.meta.fee,
      instructions: tx.transaction.message.instructions.length,
      logs: tx.meta.logMessages
    }));
    
    // Batch insert
    await database.insertMany(records);
    processedCount += records.length;
    
    console.log(`Processed ${processedCount} transactions`);
    
    paginationToken = response.paginationToken;
    
  } while (paginationToken !== null);
}
```

### Export to CSV

```typescript
import fs from 'fs';

async function exportTransactionsToCSV(filename: string) {
  const stream = fs.createWriteStream(filename);
  
  // CSV header
  stream.write('signature,slot,blockTime,success,fee,instructions\n');
  
  let paginationToken = null;
  
  do {
    const response = await searchTransactions({
      transactionDetails: TransactionDetails.Full,
      limit: 100,
      paginationToken
    });
    
    response.data.forEach(tx => {
      const row = [
        tx.signature,
        tx.slot,
        tx.blockTime,
        tx.meta.err === null ? 'true' : 'false',
        tx.meta.fee,
        tx.transaction.message.instructions.length
      ].join(',');
      
      stream.write(row + '\n');
    });
    
    paginationToken = response.paginationToken;
    
  } while (paginationToken !== null);
  
  stream.end();
  console.log(`✅ Export complete: ${filename}`);
}
```

## Troubleshooting

**Q: Getting timeout errors?**
- Reduce `limit` parameter (try 10-50 instead of 100)
- Add delays between requests
- Use signatures mode first, then fetch full details selectively

**Q: Response too slow?**
- Full mode is inherently slower than signatures mode
- Consider using signatures mode when possible
- Implement caching for frequently accessed transactions

**Q: Missing fields in response?**
- Some fields may be null for older transactions
- Always check for field existence before accessing
- Refer to API documentation for field availability

**Q: How to handle failed transactions?**
- Check `tx.meta.err` field
- Failed transactions still consume fees
- Logs may contain error details

## Related Topics

- [Basic Search](BASIC_SEARCH.md) - Getting started with signatures
- [Pagination](PAGINATION.md) - Handle large result sets
- [API Reference](API.md) - Complete parameter documentation

---

*Need help? Join our [Discord community](https://discord.com/invite/RXBmKSdVRe)*