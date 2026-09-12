# Dynamic Portfolio Dashboard

A dynamic portfolio dashboard built with Next.js, React, TypeScript, Tailwind CSS, and Node.js.

## Prerequisites

* Node.js 18 or later
* npm

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd <project-folder>
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application in your browser:

```text
http://localhost:3000
```

## Usage

The dashboard displays the portfolio holdings grouped by sector.

For each holding, the dashboard displays:

* Particulars
* Purchase Price
* Quantity
* Investment
* Portfolio Percentage
* NSE/BSE
* Current Market Price (CMP)
* Present Value
* Gain/Loss
* P/E Ratio
* Latest Earnings

The dashboard automatically refreshes market data every 15 seconds.

## Portfolio Data

The initial portfolio data is stored in:

```text
data/seed.json
```

The API combines this portfolio information with market data retrieved from Yahoo Finance.

## API

The portfolio data can also be accessed directly through:

```text
GET /api/stocks
```

For example:

```text
http://localhost:3000/api/stocks
```

The API returns the portfolio holdings along with live market data, calculations, sector summaries, and grand totals.

## Data Sources

* Portfolio holdings: `data/seed.json`
* Market data: Yahoo Finance
* Market data integration: `yahoo-finance2`

## Build for Production

Create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```
