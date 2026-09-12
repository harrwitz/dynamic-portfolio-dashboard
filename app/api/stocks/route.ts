import { NextResponse } from 'next/server';
import seedData from '@/data/seed.json';
import { Staticstock } from '@/lib/types';
import { fetchQuoteDataForSymbols, StockLookup } from '@/lib/fetchers';
import { buildLiveStock, groupBySector, buildPortfolioResponse } from '@/lib/portfolio';

export async function GET() {
    try {
        const stocks = seedData as Staticstock[];

        const lookups: StockLookup[] = stocks.map(stock => ({
            name: stock.name,
            exchange: stock.exchange,
        }));
        const quotes = await fetchQuoteDataForSymbols(lookups);

        const totalInvestment = stocks.reduce((sum, stock) => sum + (stock.purchasePrice * stock.quantity), 0);
        const liveStocks = stocks.map(stock => buildLiveStock(stock, quotes[stock.exchange], totalInvestment));
        const sectors = groupBySector(liveStocks);
        const response = buildPortfolioResponse(sectors);

        return NextResponse.json(response);
    } catch (error) {
        console.error('Failed to build portfolio response:', error);
        return NextResponse.json({ error: 'Failed to build portfolio response' }, { status: 500 });
    }
}