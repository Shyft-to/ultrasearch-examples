/**
 * Type definitions for UltraSearch RPC API
 */

/**
 * Level of transaction detail in the response
 */
export enum TransactionDetails {
  /**
   * Only transaction signatures (fast, lightweight)
   * Default mode, max 1000 results per request
   */
  Signatures = "signatures",

  /**
   * Complete transaction data including instructions, logs, and metadata
   * Slower, max 100 results per request
   */
  Full = "full",
}

/**
 * Sort order for results based on slot number
 */
export enum SortOrder {
  /**
   * Ascending order (oldest first)
   */
  ASC = "ASC",

  /**
   * Descending order (newest first)
   */
  DESC = "DESC",
}

/**
 * Search parameters for transaction queries
 * All parameters are optional
 */
export interface SearchParams {
  /**
   * Include transactions involving ANY of these accounts (OR logic)
   * @example ["TokenProgram...", "WalletAddress..."]
   */
  accountInclude?: string[];

  /**
   * Exclude transactions involving any of these accounts
   * @example ["VoteProgram...", "SpamAddress..."]
   */
  accountExclude?: string[];

  /**
   * Only include transactions with ALL of these accounts (AND logic)
   * @example ["USDC", "USDT", "DEX_Program"]
   */
  accountRequired?: string[];

  /**
   * Starting block number (inclusive).
   * Must be provided together with `toBlock` — specifying only one is an error.
   *
   * Default block range when omitted (together with `toBlock`):
   * - `sort: "DESC"` (default) → last 5000 blocks
   * - `sort: "ASC"` → first indexed block to first indexed block + 5000
   *
   * @example 394940000
   */
  fromBlock?: number;

  /**
   * Ending block number (inclusive).
   * Must be provided together with `fromBlock` — specifying only one is an error.
   *
   * Default block range when omitted (together with `fromBlock`):
   * - `sort: "DESC"` (default) → last 5000 blocks
   * - `sort: "ASC"` → first indexed block to first indexed block + 5000
   *
   * @example 394941496
   */
  toBlock?: number;

  /**
   * Filter vote transactions
   * - true: only vote transactions
   * - false: exclude vote transactions
   * - undefined: include all
   */
  vote?: boolean;

  /**
   * Filter failed transactions
   * - true: only failed transactions
   * - false: exclude failed transactions
   * - undefined: include all
   */
  failed?: boolean;

  /**
   * Sort order (default: DESC)
   */
  sort?: SortOrder;

  /**
   * Pagination token from previous response
   * Format: "slot:transactionIndex" (e.g., "394941095:1232")
   * null when no more results available
   */
  paginationToken?: string;

  /**
   * Maximum results per request
   * - Signatures mode: max 1000, default 1000
   * - Full mode: max 100, default 100
   */
  limit?: number;

  /**
   * Level of detail in response (default: signatures)
   */
  transactionDetails?: TransactionDetails;
}

/**
 * JSON-RPC request structure for searchTransactions method
 */
export interface SearchTransactionsRpcRequest {
  /**
   * JSON-RPC version (always "2.0")
   */
  jsonrpc: "2.0";

  /**
   * Request identifier (can be number or string)
   * Used to match requests with responses
   */
  id: number | string;

  /**
   * RPC method name (always "searchTransactions")
   */
  method: "searchTransactions";

  /**
   * Search parameters
   */
  params: SearchParams;
}

/**
 * Transaction signature response (signatures mode)
 */
export interface TransactionSignature {
  /**
   * Transaction signature (unique identifier)
   */
  signature: string;

  /**
   * Slot number where transaction was processed
   */
  slot: number;

  /**
   * Unix timestamp of the block
   */
  blockTime: number;
}

/**
 * Response structure from searchTransactions
 */
export interface SearchTransactionsResponse {
  /**
   * JSON-RPC version
   */
  jsonrpc: "2.0";

  /**
   * Request identifier (matches the request)
   */
  id: number | string;

  /**
   * Search results
   */
  result: {
    /**
     * Array of transactions (format depends on transactionDetails param)
     */
    data: TransactionSignature[] | any[];

    /**
     * Token for fetching next page
     * Format: "slot:transactionIndex"
     * null if no more results
     */
    paginationToken: string | null;
  };
}

/**
 * RPC error response structure
 */
export interface RpcError {
  /**
   * JSON-RPC version
   */
  jsonrpc: "2.0";

  /**
   * Request identifier
   */
  id: number | string;

  /**
   * Error details
   */
  error: {
    /**
     * Error code
     */
    code: number;

    /**
     * Error message
     */
    message: string;

    /**
     * Additional error data (optional)
     */
    data?: any;
  };
}
