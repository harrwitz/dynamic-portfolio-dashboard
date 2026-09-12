export interface Staticstock {
    sector: string;
    name: string;
    quantity: number;
    purchasePrice: number;
    exchange: string;
}

export interface LiveStock extends Staticstock {
    cmp:number | null;
    peRatio:number | null;
    latestEarnings: number | null;
    investmentValue: number;
    presentValue: number | null;
    gainLoss: number | null;
    portfolioPercentage: number;
    isStale?: boolean;
}
export interface SectorSummary {
    sectorName: string;
    stocks: LiveStock[];
    totalInvestment: number;
    totalPresentValue: number | null;
    totalGainLoss: number | null;
}
export interface PortfolioResponse {
    sectors: SectorSummary[];
    grandTotalInvestment: number;
    grandTotalPresentValue: number | null;
    grandTotalGainLoss: number | null;
}