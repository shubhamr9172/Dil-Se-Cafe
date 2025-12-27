import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
    data: { date: string; revenue: number; orders: number }[];
}

export default function SalesChart({ data }: SalesChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 md:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke="#6b7280"
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    padding: '8px 12px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={{ fill: '#f97316', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
