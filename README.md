# UltraSearch Examples 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-9945FF?style=flat&logo=solana&logoColor=white)](https://solana.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Code examples for integrating UltraSearch RPC API into your Solana applications

## 📖 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Examples](#-examples)
- [API Reference](#-api-reference)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

## 🎯 About

**UltraSearch Examples** is a comprehensive collection of code examples demonstrating how to use the UltraSearch RPC API for searching and filtering Solana blockchain transactions. Whether you're building a DeFi dashboard, analyzing on-chain data, or tracking specific wallet activities, these examples will help you get started quickly.

### What is UltraSearch?

UltraSearch is a high-performance Solana RPC API that enables developers to search and filter blockchain transactions with precision. Unlike traditional RPC methods, UltraSearch provides:

- **Flexible Filtering**: Search by accounts, block ranges, transaction status
- **High Performance**: Optimized queries for fast data retrieval
- **Developer-Friendly**: Simple JSON-RPC interface with TypeScript support

## ✨ Features

- 🔍 **Transaction Search**: Find transactions by account addresses, block ranges, and more
- 📊 **Flexible Filtering**: Include, exclude, or require specific accounts in search results
- 🎯 **Sorting & Pagination**: Control result order and efficiently paginate through large datasets
- 📦 **TypeScript Support**: Fully typed interfaces and enums for type-safe development
- 🚀 **Real-World Examples**: Production-ready code snippets for common use cases
- 📚 **Comprehensive Documentation**: Detailed guides and API references

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Basic knowledge of TypeScript and Solana blockchain
- UltraSearch API key ([Get yours here](https://shyft.to))

### Installation

```bash
# Clone the repository
git clone https://github.com/Shyft-to/ultrasearch-examples.git
cd ultrasearch-examples

# Navigate to TypeScript examples
cd examples/typescript

# Install dependencies
npm install

# Run examples
npm run start
```

### Your First Query

```typescript
import axios from "axios";
import { SearchTransactionsRpcRequest } from "./types";

const RPC_URL = "https://rpc.shyft.to?api_key=YOUR_API_KEY";

async function fetchLatestTransactions() {
  const request: SearchTransactionsRpcRequest = {
    jsonrpc: "2.0",
    id: 1,
    method: "searchTransactions",
    params: {
      transactionDetails: "full",
      limit: 10
    }
  };
  
  const response = await axios.post(RPC_URL, request);
  console.log(response.data.result);
}
```

## 📚 Examples

Our example collection covers common use cases for blockchain data retrieval:

### Available Examples

| Example | Description | Use Case |
|---------|-------------|----------|
| **[Basic Search](examples/typescript/docs/BASIC_SEARCH.md)** | Fetch latest transaction signatures | Getting started, recent activity |
| **[Full Transactions](examples/typescript/docs/FULL_TRANSACTIONS.md)** | Retrieve complete transaction data | Detailed analysis, audit logs |
| **[Pagination](examples/typescript/docs/PAGINATION.md)** | Handle large result sets efficiently | Data exports, batch processing |

### 🏗️ Project can be build using this API call

- Token Transfer Tracker
- DeFi Transaction Dashboard
- Monitoring Pump.fun Trading Activity

## 🔧 API Reference

### Search Parameters

The `searchTransactions` method accepts the following parameters:

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `accountInclude` | `string[]` | Include transactions involving any of these accounts | `undefined` |
| `accountExclude` | `string[]` | Exclude transactions involving these accounts | `undefined` |
| `accountRequired` | `string[]` | Only include transactions with ALL these accounts | `undefined` |
| `fromBlock` | `number` | Starting block number (inclusive) | Latest blocks |
| `toBlock` | `number` | Ending block number (inclusive) | Latest blocks |
| `vote` | `boolean` | Include/exclude vote transactions | `undefined` |
| `failed` | `boolean` | Include/exclude failed transactions | `undefined` |
| `sort` | `"ASC" \| "DESC"` | Sort order by slot number | `"ASC"` |
| `limit` | `number` | Maximum results per request | `1000` (signatures), `100` (full) |
| `paginationToken` | `string` | Token for fetching next page | `undefined` |
| `transactionDetails` | `"signatures" \| "full"` | Level of detail in response | `"signatures"` |

### Response Format

```typescript
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "data": [...],
    "paginationToken": "394941095:1232" // null if no more pages
  }
}
```

**[View Full API Documentation →](examples/typescript/docs/API.md)**

## 🤝 Contributing

We welcome contributions! Whether it's:

- 🐛 Bug fixes
- ✨ New examples
- 📖 Documentation improvements
- 💡 Feature suggestions

Please read our [Contributing Guide](CONTRIBUTING.md) to get started.

### Quick Contribution Steps

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-example`)
3. Commit your changes (`git commit -m 'Add amazing example'`)
4. Push to the branch (`git push origin feature/amazing-example`)
5. Open a Pull Request

## 💬 Support

- 📖 [Documentation](https://docs.shyft.to)
- 💬 [Discord Community](https://discord.com/invite/RXBmKSdVRe)
- 🐦 [𝕏](https://x.com/shyft_hq)
- 📧 Email: genesis@shyft.to

### Frequently Asked Questions

**Q: How do I get an API key?**
A: Visit [shyft.to](https://shyft.to) and sign up for a trial/paid plan.

**Q: What are the rate limits?**
A: Rate limits depend on your subscription tier. Check your dashboard for details.

**Q: Can I use this in production?**
A: Yes! These examples are production-ready. Just ensure you follow security best practices.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Built with [TypeScript](https://www.typescriptlang.org/)
- Powered by [Shyft](https://shyft.to)
- Inspired by the Solana developer community

---

**Made with ❤️ by the Solana community**

[⬆ Back to Top](#ultrasearch-examples-)
