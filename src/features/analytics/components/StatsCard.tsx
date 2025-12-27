import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';


interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    prefix?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend, prefix = '' }: StatsCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-500 mb-1">{title}</p>
                        <h3 className="text-2xl md:text-3xl font-bold text-secondary-900">
                            {prefix}{typeof value === 'number' ? value.toLocaleString() : value}
                        </h3>
                        {trend && (
                            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                            </p>
                        )}
                    </div>
                    <div className="ml-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-primary-100 flex items-center justify-center">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-primary-600" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
