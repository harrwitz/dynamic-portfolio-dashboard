'use client';

import { useCallback, useEffect, useState } from 'react';
import SectorGroup from '@/components/SectorGroup';
import { PortfolioResponse } from '@/lib/types';

export default function Home() {
    const [portfolio, setPortfolio] =
        useState<PortfolioResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchPortfolio = useCallback(async () => {
        try {
            const response = await fetch('/api/stocks', {
                cache: 'no-store',
            });

            if (!response.ok) {
                throw new Error('Failed to fetch portfolio data');
            }

            const data: PortfolioResponse = await response.json();

            setPortfolio(data);
            setError(null);
            setLastUpdated(new Date());
        } catch (error) {
            console.error(error);
            setError('Unable to update portfolio data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPortfolio();

        const interval = setInterval(() => {
            fetchPortfolio();
        }, 15000);

        return () => clearInterval(interval);
    }, [fetchPortfolio]);

    if (loading) {
        return (
            <main className="p-6">
                <p>Loading portfolio...</p>
            </main>
        );
    }

    if (!portfolio) {
        return (
            <main className="p-6">
                <p>{error ?? 'Unable to load portfolio'}</p>
            </main>
        );
    }

    return (
        <main className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Portfolio Dashboard
                </h1>

                <div className="mt-2 text-sm text-gray-500">
                    <span>
                        Last updated:{' '}
                        {lastUpdated
                            ? lastUpdated.toLocaleTimeString()
                            : '—'}
                    </span>

                    {error && (
                        <span className="ml-3 text-red-500">
                            {error}
                        </span>
                    )}
                </div>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Grand Total Investment
                    </p>
                    <p className="text-xl font-bold">
                        ₹
                        {portfolio.grandTotalInvestment.toLocaleString(
                            'en-IN'
                        )}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Grand Total Present Value
                    </p>
                    <p className="text-xl font-bold">
                        ₹
                        {portfolio.grandTotalPresentValue?.toLocaleString(
                            'en-IN'
                        ) ?? '—'}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-gray-500">
                        Grand Total Gain/Loss
                    </p>
                    <p className="text-xl font-bold">
                        {portfolio.grandTotalGainLoss !== null
                            ? `₹${portfolio.grandTotalGainLoss.toLocaleString(
                                  'en-IN'
                              )}`
                            : '—'}
                    </p>
                </div>
            </div>

            {portfolio.sectors.map((sector) => (
                <SectorGroup
                    key={sector.sectorName}
                    sector={sector}
                />
            ))}
        </main>
    );
}