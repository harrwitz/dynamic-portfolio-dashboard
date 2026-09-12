import YahooFinance from 'yahoo-finance2';
import { getFromCache, setInCache, getStale } from './cache';

const yahooFinance = new YahooFinance({
    suppressNotices: ['yahooSurvey'],
});

export interface QuoteData {
    cmp: number | null;
    peRatio: number | null;
    latestEarnings: number | null;
    isStale?: boolean;
}

export interface StockLookup {
    name: string;
    exchange: string;
}

const symbolMap: Record<string, string> = {
    '511577': 'MANTRA.BO',
    LTIM: 'LTM.NS',
    '543517': 'HARIOMPIPE.NS',
};

export function toYahooSymbol(exchange: string): string {
    if (symbolMap[exchange]) {
        return symbolMap[exchange];
    }

    return /^\d+$/.test(exchange)
        ? `${exchange}.BO`
        : `${exchange}.NS`;
}

export async function resolveSymbol(
    name: string,
    exchange: string
): Promise<string> {
    if (symbolMap[exchange]) {
        return symbolMap[exchange];
    }

    const isBseCode = /^\d+$/.test(exchange);

    const symbols = isBseCode
        ? [`${exchange}.BO`, `${exchange}.NS`]
        : [`${exchange}.NS`, `${exchange}.BO`];

    for (const symbol of symbols) {
        try {
            const quote = await yahooFinance.quote(symbol);

            if (
                quote &&
                quote.quoteType === 'EQUITY' &&
                quote.regularMarketPrice !== undefined
            ) {
                return symbol;
            }
        } catch {}
    }

    try {
        const results = await yahooFinance.search(name);

        const match = results.quotes.find(
            (quote: any) =>
                quote.quoteType === 'EQUITY' &&
                typeof quote.symbol === 'string' &&
                (quote.symbol.endsWith('.NS') ||
                    quote.symbol.endsWith('.BO'))
        );

        if (match) {
            return match.symbol as string;
        }
    } catch (error) {
        console.error(
            `Yahoo search failed for ${name}:`,
            error
        );
    }

    return symbols[0];
}

export async function fetchQuoteData(
    name: string,
    exchange: string
): Promise<QuoteData> {
    const symbol = await resolveSymbol(name, exchange);
    const cacheKey = `quote:${symbol}`;

    const cached = getFromCache<QuoteData>(cacheKey);

    if (cached) {
        return cached;
    }

    try {
        const quote = await yahooFinance.quote(symbol);

        if (
            !quote ||
            quote.quoteType !== 'EQUITY' ||
            quote.regularMarketPrice === undefined
        ) {
            throw new Error(
                `Invalid equity data for symbol ${symbol}`
            );
        }

        const quoteData: QuoteData = {
            cmp: quote.regularMarketPrice ?? null,
            peRatio: quote.trailingPE ?? null,
            latestEarnings:
                quote.epsTrailingTwelveMonths ?? null,
        };

        setInCache(cacheKey, quoteData);

        return quoteData;
    } catch (error) {
        console.error(
            `Error fetching ${name} (${exchange} -> ${symbol}):`,
            error
        );

        const stale = getStale<QuoteData>(cacheKey);

        if (stale) {
            return {
                ...stale,
                isStale: true,
            };
        }

        return {
            cmp: null,
            peRatio: null,
            latestEarnings: null,
            isStale: true,
        };
    }
}

export async function fetchQuoteDataForSymbols(
    stocks: StockLookup[]
): Promise<Record<string, QuoteData>> {
    const results: Record<string, QuoteData> = {};
    const batchSize = 5;

    for (let i = 0; i < stocks.length; i += batchSize) {
        const batch = stocks.slice(i, i + batchSize);

        await Promise.all(
            batch.map(async (stock) => {
                const quoteData = await fetchQuoteData(
                    stock.name,
                    stock.exchange
                );

                results[stock.exchange] = quoteData;
            })
        );

        if (i + batchSize < stocks.length) {
            await new Promise((resolve) =>
                setTimeout(resolve, 300)
            );
        }
    }

    return results;
}