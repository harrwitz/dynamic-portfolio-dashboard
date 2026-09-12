'use client';

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { LiveStock } from '@/lib/types';
import GainLossCell from './GainLossCell';

const columnHelper = createColumnHelper<LiveStock>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Particulars',
    cell: (info) => (
      <span>
        {info.getValue()}
        {info.row.original.isStale && (
          <span
            className="ml-1 text-xs text-orange-500"
            title="Using last known data — live fetch failed"
          >
            ⚠
          </span>
        )}
      </span>
    ),
  }),
  columnHelper.accessor('purchasePrice', {
    header: 'Purchase Price',
    cell: (info) => `₹${info.getValue().toLocaleString('en-IN')}`,
  }),
  columnHelper.accessor('quantity', {
    header: 'Qty',
  }),
  columnHelper.accessor('investmentValue', {
    header: 'Investment',
    cell: (info) => `₹${info.getValue().toLocaleString('en-IN')}`,
  }),
  columnHelper.accessor('portfolioPercentage', {
    header: 'Portfolio (%)',
    cell: (info) => `${(info.getValue() * 100).toFixed(2)}%`,
  }),
  columnHelper.accessor('exchange', {
    header: 'NSE/BSE',
    cell: (info) => {
        const exchange = info.getValue();

       return /^\d+$/.test(exchange)?`BSE(${exchange})`:`NSE(${exchange})`;
    }   
  }),
  columnHelper.accessor('cmp', {
    header: 'CMP',
    cell: (info) => {
      const value = info.getValue();
      return value !== null ? `₹${value.toLocaleString('en-IN')}` : '—';
    },
  }),
  columnHelper.accessor('presentValue', {
    header: 'Present Value',
    cell: (info) => {
      const value = info.getValue();
      return value !== null ? `₹${value.toLocaleString('en-IN')}` : '—';
    },
  }),
  columnHelper.accessor('gainLoss', {
    header: 'Gain/Loss',
    cell: (info) => <GainLossCell value={info.getValue()} />,
  }),
  columnHelper.accessor('peRatio', {
    header: 'P/E Ratio',
    cell: (info) => info.getValue() ?? '—',
  }),
  columnHelper.accessor('latestEarnings', {
    header: 'Latest Earnings',
    cell: (info) => info.getValue() ?? '—',
  }),
];

interface PortfolioTableProps {
  stocks: LiveStock[];
}

export default function PortfolioTable({ stocks }: PortfolioTableProps) {
  const table = useReactTable({
    data: stocks,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="w-full border-collapse text-sm bg-white text-gray-900">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id} className="border-b-2 border-gray-300 bg-gray-50 text-gray-900">
            {headerGroup.headers.map((header) => (
              <th key={header.id} className="text-left p-2 font-semibold">
                {flexRender(header.column.columnDef.header, header.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-50">
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id} className="p-2">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}