import { Button } from '../../../components/ui/Button';
import type { DateRange } from '../analyticsUtils';


interface DateRangePickerProps {
    selected: DateRange;
    onSelect: (range: DateRange) => void;
}

export default function DateRangePicker({ selected, onSelect }: DateRangePickerProps) {
    const ranges: { value: DateRange; label: string }[] = [
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' },
    ];

    return (
        <div className="flex flex-wrap gap-2">
            {ranges.map((range) => (
                <Button
                    key={range.value}
                    variant={selected === range.value ? 'primary' : 'outline'}
                    onClick={() => onSelect(range.value)}
                    className="text-sm"
                >
                    {range.label}
                </Button>
            ))}
        </div>
    );
}
