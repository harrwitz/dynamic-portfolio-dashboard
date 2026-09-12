import { SectorSummary } from '@/lib/types';
import PortfolioTable from './PortfolioTable';
import GainLossCell from './GainLossCell';

interface SectorGroupProps {
  sector: SectorSummary;
}

export default function SectorGroup({ sector }: SectorGroupProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between bg-gray-100 p-3 rounded-t border border-gray-300 text-gray-900">
        <h2 className="font-bold text-lg">{sector.sectorName}</h2>
        <div className="flex gap-6 text-sm">
          <span>
            <span className="text-gray-500">Investment: </span>
            <span className="font-semibold">
              ₹{sector.totalInvestment.toLocaleString('en-IN')}
            </span>
          </span>
          <span>
            <span className="text-gray-500">Present Value: </span>
            <span className="font-semibold">
              {sector.totalPresentValue !== null
                ? `₹${sector.totalPresentValue.toLocaleString('en-IN')}`
                : '—'}
            </span>
          </span>
          <span>
            <span className="text-gray-500">Gain/Loss: </span>
            <GainLossCell value={sector.totalGainLoss} />
          </span>
        </div>
      </div>
      <div className="border border-t-0 border-gray-300 rounded-b overflow-x-auto">
        <PortfolioTable stocks={sector.stocks} />
      </div>
    </div>
  );
}