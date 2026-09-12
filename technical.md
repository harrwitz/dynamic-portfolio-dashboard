# Dynamic Portfolio Dashboard — Technical Document

## 1. Overview

The objective was to build a dynamic portfolio dashboard that combines static portfolio information with live market data and presents the holdings sector-wise.

The application was built using Next.js, React, TypeScript, Tailwind CSS, Node.js, and Yahoo Finance through `yahoo-finance2`.

The main responsibilities of the application are:

* Loading the portfolio data
* Fetching live market information
* Calculating portfolio values and Gain/Loss
* Grouping holdings by sector
* Refreshing market data periodically
* Handling external API failures and rate limits

---

## 2. Challenge: Mapping NSE and BSE Identifiers

The portfolio contains both NSE symbols and BSE scrip codes. These identifiers do not always map directly to the symbol format expected by Yahoo Finance.

For example, NSE symbols generally use `.NS`, while BSE securities may use `.BO`.

### Solution

A symbol resolution layer was implemented to convert the portfolio's exchange identifier into a Yahoo Finance-compatible symbol.

The original NSE/BSE identifier is retained for display, while the resolved Yahoo Finance symbol is used internally for fetching market data.

This keeps the portfolio data independent from the external provider's symbol format.

---

## 3. Challenge: Changed Company Names and Stock Symbols

Some holdings could not be resolved using their original portfolio identifiers because company names and trading symbols can change.

During testing, examples included:

* Savani Financials → Mantra Capital
* LTIM → LTM
* HariOm Pipes → HARIOMPIPE

### Solution

Specific symbol mappings were added for these known exceptions.

```text
511577 → MANTRA.BO
LTIM   → LTM.NS
543517 → HARIOMPIPE.NS
```

The mapping is kept inside the market-data fetching layer so that the original portfolio data does not need to be modified.

---

## 4. Challenge: External API Failures

Yahoo Finance is an external service, so individual requests can fail due to network issues, unavailable symbols, temporary provider errors, or rate limiting.

A failure for one stock should not make the entire portfolio unavailable.

### Solution

Each stock is fetched independently. If a request fails, the application checks the cache for previously available data.

If cached data exists, it is returned and the stock is marked as stale.

If no cached data exists, unavailable values are returned as `null` and displayed as `—` in the UI.

---

## 5. Challenge: Rate Limiting

The portfolio contains multiple stocks, which can result in many external API requests.

Sending all requests simultaneously increases the possibility of hitting provider rate limits.

### Solution

Requests are processed in batches instead of requesting every stock simultaneously.

A short delay is added between batches to reduce the request rate.

The application also caches successful responses to avoid unnecessary repeated requests.

---

## 6. Challenge: Continuous Data Updates

The dashboard needs to update market information approximately every 15 seconds.

### Solution

The frontend performs an initial request to `/api/stocks` and then uses `setInterval` to request updated data every 15 seconds.

The interval is cleared when the component is unmounted.

This provides periodic updates without introducing the additional complexity of WebSockets.

---

## 7. Challenge: Portfolio and Sector Calculations

The application needs to calculate values at both stock and sector level.

The following calculations are performed:

### Investment Value

```text
Investment Value = Purchase Price × Quantity
```

### Present Value

```text
Present Value = CMP × Quantity
```

### Gain/Loss

```text
Gain/Loss = Present Value − Investment Value
```

### Portfolio Percentage

```text
Portfolio Percentage =
Investment Value ÷ Total Portfolio Investment × 100
```

The same values are aggregated to generate sector-level and grand totals.

---

## 8. Challenge: Handling Missing Stock Data in Aggregations

Initially, if one stock did not have a valid CMP, the entire sector's Present Value and Gain/Loss could become unavailable.

For example, if four stocks had valid market data and one stock failed, the four available stocks should still contribute to the sector total.

### Solution

The aggregation logic was changed to calculate Present Value and Gain/Loss using the stocks with available market data.

This prevents a single failed external request from invalidating the entire sector or portfolio calculation.

---

## 9. Data Flow

The final data flow is:

```text
Portfolio JSON
      ↓
Next.js API Route
      ↓
Symbol Resolution
      ↓
Yahoo Finance
      ↓
Market Data
      ↓
Portfolio Calculations
      ↓
Sector Aggregation
      ↓
JSON Response
      ↓
React Dashboard
```

The separation between data retrieval and calculations also makes the application easier to maintain.

---

## 10. Caching Strategy

Market data is stored in an in-memory cache.

When a request is received:

```text
Check Cache
    ↓
Data Available?
   / \
 Yes  No
 ↓     ↓
Return  Fetch Yahoo Finance
        ↓
      Cache Result
        ↓
      Return Data
```

If a fresh request fails, previously cached data can be used as a fallback.

The cache is intentionally simple because the application is a small portfolio dashboard and does not require a distributed caching system.

---

## 11. Key Design Decisions

### Polling instead of WebSockets

The requirement only calls for periodic updates. A 15-second polling mechanism is simpler to implement and maintain than a WebSocket infrastructure.

### Batch requests

Batching reduces simultaneous external requests and helps control API usage.

### Separate portfolio and market data

Portfolio information is treated as static input, while market information is dynamically fetched. This prevents external provider changes from modifying the original portfolio information.

### Server-side market-data retrieval

Market-data requests are performed through the backend rather than directly from the browser. This keeps the external API integration isolated from the UI.

---

## 12. Limitations

* Market data depends on Yahoo Finance availability.
* External market data may occasionally be delayed or unavailable.
* Some securities require symbol mappings because their exchange identifiers differ from their current provider symbols.
* The current cache is in-memory and is reset when the server restarts.
* The application uses polling rather than a real-time market-data stream.

## Conclusion

The final implementation provides a functional portfolio dashboard with live market-data enrichment, automatic updates, sector-wise aggregation, caching, rate-limit handling, and graceful handling of external API failures.

The implementation prioritizes simplicity and reliability while meeting the requirements of the case study.
