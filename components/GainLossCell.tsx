interface GainLossCellProps {
    value: number | null;
}

export default function GainLossCell({ value }: GainLossCellProps) {
    if (value === null) {
        return <span className="text-gray-500">N/A</span>;
    }

    const isGain = value > 0;
    const colorClass = isGain ? 'text-green-600' : 'text-red-600';
    const formatted = Math.abs(value).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    const display = value >= 0 ? `+₹${formatted}` : `-₹${formatted}`;

    return(
        <span className={colorClass}>
            {display}
        </span>
    );
}