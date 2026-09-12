import { Staticstock, LiveStock, SectorSummary, PortfolioResponse } from './types';
import { QuoteData } from './fetchers';

export function buildLiveStock(
  stock: Staticstock,
  quote: QuoteData | undefined,
  totalInvestment: number
): LiveStock {
  const safeQuote: QuoteData = quote ?? {
    cmp: null,
    peRatio: null,
    latestEarnings: null,
    isStale: true,
  };

  const investmentValue = stock.purchasePrice * stock.quantity;
  const presentValue = safeQuote.cmp !== null ? safeQuote.cmp * stock.quantity : null;
  const gainLoss = presentValue !== null ? presentValue - investmentValue : null;
  const portfolioPercentage = totalInvestment > 0 ? investmentValue / totalInvestment : 0;

  return {
    ...stock,
    cmp: safeQuote.cmp,
    peRatio: safeQuote.peRatio,
    latestEarnings: safeQuote.latestEarnings,
    investmentValue,
    presentValue,
    gainLoss,
    portfolioPercentage,
    isStale: safeQuote.isStale ?? false,
  };
}

export function groupBySector(stocks: LiveStock[]): SectorSummary[] {
  const sectorMap = new Map<string, LiveStock[]>();

  for (const stock of stocks) {
    const existing = sectorMap.get(stock.sector) ?? [];
    existing.push(stock);
    sectorMap.set(stock.sector, existing);
  }

  const summaries: SectorSummary[] = [];

  for (const [sectorName, sectorStocks] of sectorMap.entries()) {
    const totalInvestment = sectorStocks.reduce((sum, s) => sum + s.investmentValue, 0);

    const hasAllPresentValues = sectorStocks.every(s => s.presentValue !== null);
    const totalPresentValue = hasAllPresentValues
      ? sectorStocks.reduce((sum, s) => sum + (s.presentValue as number), 0)
      : null;

    const totalGainLoss = totalPresentValue !== null
      ? totalPresentValue - totalInvestment
      : null;

    summaries.push({
      sectorName,
      stocks: sectorStocks,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
    });
  }

  return summaries;
}

export function buildPortfolioResponse(sectors: SectorSummary[]): PortfolioResponse {
  const grandTotalInvestment = sectors.reduce((sum, s) => sum + s.totalInvestment, 0);

  const hasAllSectorTotals = sectors.every(s => s.totalPresentValue !== null);
  const grandTotalPresentValue = hasAllSectorTotals
    ? sectors.reduce((sum, s) => sum + (s.totalPresentValue as number), 0)
    : null;

  const grandTotalGainLoss = grandTotalPresentValue !== null
    ? grandTotalPresentValue - grandTotalInvestment
    : null;

  return {
    sectors,
    grandTotalInvestment,
    grandTotalPresentValue,
    grandTotalGainLoss,
  };
}