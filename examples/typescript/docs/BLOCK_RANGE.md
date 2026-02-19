# Block Range Rules

This page is the single source of truth for how `fromBlock` and `toBlock` work in UltraSearch queries.

## Basic Rule

`fromBlock` and `toBlock` must **always be specified together**. Providing only one of the two returns an error. Either supply both or omit both.

```typescript
// ✅ Correct — both provided
{ fromBlock: 394940000, toBlock: 394941496 }

// ✅ Correct — both omitted (API applies default window)
{}

// ❌ Error — only one provided
{ fromBlock: 394940000 }
```

## Default Block Range

When **neither** `fromBlock` nor `toBlock` is provided, the API automatically selects a 5000-block window. The exact window depends on `sort` order and whether a `paginationToken` is present:

**No `paginationToken` (initial request):**

| `sort` value | Default window |
|---|---|
| `"DESC"` (default) | Last 5000 blocks |
| `"ASC"` | First indexed block → first indexed block + 5000 |

**With `paginationToken` (subsequent page, no explicit block range):**

The slot embedded in the pagination token (`"slot:transactionIndex"`) acts as the reference point:

| `sort` value | Default window |
|---|---|
| `"DESC"` | `paginationToken` slot − 5000 → `paginationToken` slot |
| `"ASC"` | `paginationToken` slot → `paginationToken` slot + 5000 |

## Tips

- Block numbers are Solana **slot** numbers.
- Both `fromBlock` and `toBlock` are **inclusive**.
- `toBlock` must be greater than or equal to `fromBlock`.
- For consistent multi-page results, always specify an explicit range and keep it the same across all pages.
