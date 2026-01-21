/**
 * UltraSearch TypeScript Examples
 *
 * This file demonstrates various use cases for the UltraSearch RPC API.
 * Uncomment the example you want to run at the bottom of this file.
 *
 * For detailed documentation, see:
 * - docs/API.md - Complete API reference
 * - docs/BASIC_SEARCH.md - Getting started guide
 * - README.md - Overview and setup instructions
 */

import axios from "axios";
import {
  SearchTransactionsRpcRequest,
  SortOrder,
  TransactionDetails,
} from "./types/search-transactions-req";

// ============================================================================
// Configuration
// ============================================================================

/**
 * RPC endpoint with API key
 * Get your API key from: https://shyft.to
 */
const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";

/**
 * Helper function to make RPC requests
 */
async function searchTransactions(
  requestBody: SearchTransactionsRpcRequest,
): Promise<any> {
  try {
    const response = await axios.post(RPC_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.error) {
      console.error("RPC Error:", response.data.error);
      throw new Error(response.data.error.message);
    }

    return response.data.result;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
}

// ============================================================================
// Example 1: Fetch Latest Signatures
// ============================================================================

/**
 * Fetches the latest 1000 transaction signatures from the blockchain
 *
 * Use cases:
 * - Recent activity monitoring
 * - Transaction feed for dashboards
 * - Real-time blockchain updates
 *
 * Documentation: docs/BASIC_SEARCH.md
 */
async function fetchLatestSignatures() {
  console.log("\n=== Example 1: Latest Signatures ===\n");

  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "searchTransactions",
    params: {}, // Empty params gives latest 1000 signatures by default
  };

  const result = await searchTransactions(requestBody);

  console.log(`Fetched ${result.data.length} signatures`);
  console.log("\nFirst 5 signatures:");
  result.data.slice(0, 5).forEach((tx: any, index: number) => {
    console.log(`${index + 1}. ${tx.signature}`);
    console.log(`   Slot: ${tx.slot}`);
    console.log(`   Time: ${new Date(tx.blockTime * 1000).toISOString()}\n`);
  });

  console.log(`Has more results: ${result.paginationToken !== null}`);
  if (result.paginationToken) {
    console.log(`Pagination token: ${result.paginationToken}`);
  }
}

// ============================================================================
// Example 2: Fetch Full Transaction Details
// ============================================================================

/**
 * Fetches complete transaction data including instructions, logs, and metadata
 *
 * Use cases:
 * - Detailed transaction analysis
 * - Audit logs and compliance
 * - Smart contract interaction tracking
 * - Token balance change analysis
 *
 * Documentation: docs/FULL_TRANSACTIONS.md
 */
async function fetchLatestTransactions() {
  console.log("\n=== Example 2: Full Transaction Details ===\n");

  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 2,
    method: "searchTransactions",
    params: {
      transactionDetails: TransactionDetails.Full,
      limit: 5, // Limiting to 5 for readable output
    },
  };

  const result = await searchTransactions(requestBody);

  console.log(`Fetched ${result.data.length} full transactions\n`);

  result.data.forEach((tx: any, index: number) => {
    console.log(`${index + 1}. Transaction: ${tx.transaction.signatures[0]}`);
    console.log(`   Slot: ${tx.slot}`);
    console.log(`   Status: ${tx.meta.err ? "Failed" : "Success"}`);
    console.log(`   Fee: ${tx.meta.fee} lamports`);
    console.log(
      `   Instructions: ${tx.transaction.message.instructions.length}`,
    );
    console.log(`   Log messages: ${tx.meta.logMessages?.length || 0}\n`);
  });
}

// ============================================================================
// Example 3: Filter by Accounts (Block Range)
// ============================================================================

/**
 * Searches for transactions involving specific accounts within a block range
 *
 * This example tracks Pump.fun transactions (a popular Solana token launch platform)
 *
 * Use cases:
 * - DeFi protocol activity tracking
 * - Token launch monitoring
 * - Specific program interaction analysis
 * - Historical data retrieval
 *
 * Documentation: docs/ACCOUNT_FILTERING.md
 */
async function fetchPumpTransactionsWithinBlocks() {
  console.log("\n=== Example 3: Pump.fun Transactions in Block Range ===\n");

  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 3,
    method: "searchTransactions",
    params: {
      accountInclude: [
        "pAMMBay6oceH9fJKBRHGP5D4bD4sWpmSwMn52FMfXEA", // Pump.fun AMM
        "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P", // Pump.fun Program
      ],
      fromBlock: 394940000,
      toBlock: 394941496,
      transactionDetails: TransactionDetails.Full,
      limit: 10, // Max 100 when transactionDetails is Full
    },
  };

  const result = await searchTransactions(requestBody);

  console.log(
    `Found ${result.data.length} Pump.fun transactions in block range\n`,
  );

  result.data.slice(0, 5).forEach((tx: any, index: number) => {
    console.log(`${index + 1}. ${tx.transaction.signatures[0]}`);
    console.log(`   Slot: ${tx.slot}`);
    console.log(
      `   Accounts involved: ${tx.transaction.message.accountKeys.length}`,
    );
    console.log(`   Status: ${tx.meta.err ? "Failed" : "Success"}\n`);
  });
}

// ============================================================================
// Example 4: Required Accounts + Pagination
// ============================================================================

/**
 * Finds transactions where ALL specified accounts are involved
 * Demonstrates pagination for handling large result sets
 *
 * This example tracks transactions involving USDC, USDT, and Pump.fun together
 * (e.g., swaps or liquidity operations involving these assets)
 *
 * Use cases:
 * - Multi-token swap tracking
 * - Complex DeFi operation monitoring
 * - Cross-protocol transaction analysis
 * - Arbitrage opportunity detection
 *
 * Documentation: docs/PAGINATION.md
 */
async function fetchSignaturesWhereAllTokensInvolved(
  accountRequired: string[],
) {
  console.log("\n=== Example 4: Required Accounts with Pagination ===\n");

  console.log("Searching for transactions involving ALL of:");
  accountRequired.forEach((addr, i) => {
    const labels = [
      "USDC (EPjF...Dt1v)",
      "USDT (Es9v...wNYB)",
      "Pump.fun (pump...Dfn)",
    ];
    console.log(`  ${i + 1}. ${labels[i] || addr}`);
  });
  console.log();

  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 4,
    method: "searchTransactions",
    params: {
      accountRequired, // All accounts must be present in transaction
      fromBlock: 394935000,
      toBlock: 394941496,
      transactionDetails: TransactionDetails.Signatures,
      limit: 10, // Max 1000 for signatures, 100 for full
      sort: SortOrder.DESC, // Newest first
      // paginationToken: "394941095:1232", // Uncomment to fetch next page
    },
  };

  const result = await searchTransactions(requestBody);

  console.log(`Found ${result.data.length} matching transactions\n`);

  result.data.forEach((tx: any, index: number) => {
    console.log(`${index + 1}. ${tx.signature}`);
    console.log(`   Slot: ${tx.slot}`);
    console.log(`   Time: ${new Date(tx.blockTime * 1000).toISOString()}\n`);
  });

  if (result.paginationToken) {
    console.log(`\n📄 More results available!`);
    console.log(`Pagination token: ${result.paginationToken}`);
    console.log(`To fetch next page, add this token to the request params.`);
  } else {
    console.log(`\n✅ No more results (reached end of data)`);
  }
}

// ============================================================================
// Example 5: Pagination Loop
// ============================================================================

/**
 * Demonstrates how to paginate through all results using pagination tokens
 *
 * Use cases:
 * - Exporting large datasets
 * - Historical data backfilling
 * - Comprehensive transaction analysis
 *
 * Documentation: docs/PAGINATION.md
 */
async function fetchAllTransactionsWithPagination() {
  console.log("\n=== Example 5: Pagination Loop ===\n");

  let allTransactions: any[] = [];
  let paginationToken: string | null = null;
  let pageCount = 0;

  do {
    pageCount++;
    console.log(`Fetching page ${pageCount}...`);

    const requestBody: SearchTransactionsRpcRequest = {
      jsonrpc: "2.0",
      id: pageCount,
      method: "searchTransactions",
      params: {
        accountInclude: [
          "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
        ],
        fromBlock: 394940000,
        toBlock: 394940500, // Small range for demo
        limit: 100, // Signatures mode allows up to 1000
        paginationToken, // Add token from previous response
      },
    };

    const result = await searchTransactions(requestBody);

    allTransactions.push(...result.data);
    paginationToken = result.paginationToken;

    console.log(`  → Got ${result.data.length} transactions`);
    console.log(`  → Total so far: ${allTransactions.length}`);
    console.log(`  → More pages: ${paginationToken !== null ? "Yes" : "No"}\n`);

    // Safety limit for demo (remove in production)
    if (pageCount >= 3) {
      console.log("⚠️  Stopping after 3 pages (demo limit)\n");
      break;
    }
  } while (paginationToken !== null);

  console.log(
    `\n✅ Completed! Fetched ${allTransactions.length} total transactions across ${pageCount} pages`,
  );
}

// ============================================================================
// Example 6: Advanced Filtering
// ============================================================================

/**
 * Demonstrates combining multiple filter criteria
 *
 * Use cases:
 * - Complex query requirements
 * - Excluding unwanted transactions
 * - Precise data filtering
 *
 * Documentation: docs/ADVANCED_FILTERING.md
 */
async function advancedFiltering() {
  console.log("\n=== Example 6: Advanced Filtering ===\n");

  const requestBody: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 6,
    method: "searchTransactions",
    params: {
      // Include transactions with THESE accounts (OR logic)
      accountInclude: [
        "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", // SPL Token Program
      ],
      // But exclude THESE accounts
      accountExclude: [
        "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4", // Jupiter V6 Program
      ],
      // Only successful transactions
      failed: false,
      // No vote transactions
      vote: false,
      // Within specific block range
      fromBlock: 394940000,
      toBlock: 394941000,
      // Newest first
      sort: SortOrder.DESC,
      // Limited results
      limit: 10,
    },
  };

  const result = await searchTransactions(requestBody);

  console.log(`Found ${result.data.length} filtered transactions\n`);

  result.data.forEach((tx: any, index: number) => {
    console.log(`${index + 1}. ${tx.signature}`);
    console.log(`   Slot: ${tx.slot}\n`);
  });
}

// ============================================================================
// Main Execution
// ============================================================================

/**
 * Uncomment the example you want to run
 *
 * For first-time users, start with Example 1 (fetchLatestSignatures)
 */
async function main() {
  try {
    // Example 1: Basic search - good starting point
    // await fetchLatestSignatures();
    // Example 2: Get detailed transaction data
    // await fetchLatestTransactions();
    // Example 3: Filter by accounts and block range
    // await fetchPumpTransactionsWithinBlocks();
    // Example 4: Require all specified accounts (AND logic)
    await fetchSignaturesWhereAllTokensInvolved([
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB", // USDT
      "pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn", // Pump.fun
    ]);
    // Example 5: Pagination through large result sets
    // await fetchAllTransactionsWithPagination();
    // Example 6: Advanced filtering with multiple criteria
    // await advancedFiltering();
  } catch (error) {
    console.error("\n❌ Error running example:", error);
    process.exit(1);
  }
}

// Run the main function
main();
