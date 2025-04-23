import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from 'recharts';
import {formatCurrency} from '@/utils/formatters';
import {getMonthlyTrend} from "@/services/monthlyTrendService.ts";
import { useQuery } from '@tanstack/react-query';

const MonthlyTrendChart = () => {
    const { data = [], isLoading } = useQuery({
        queryKey: ['monthlyTrend'],
        queryFn: getMonthlyTrend,
    });


    const CustomTooltip = ({active, payload, label}: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background shadow-lg rounded-lg p-3 border border-border">
                    <p className="font-medium text-center">{label}</p>
                    <div className="space-y-1 mt-1">
                        {payload.map((entry: any, index: number) => (
                            <p key={`item-${index}`} className="text-sm flex items-center">
                <span
                    className="w-3 h-3 rounded-full mr-1.5"
                    style={{backgroundColor: entry.color}}
                />
                                <span>{entry.name}: {formatCurrency(entry.value)}</span>
                            </p>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const chartData = data.map((item) => ({
        name: item.label,
        receitas: item.totalIncome,
        despesas: item.totalExpense,
    }));

    if (isLoading) {
        return (
            <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card h-full">
                <h3 className="font-medium mb-4">Tendência Mensal</h3>
                <div className="h-[250px] animate-pulse bg-background/50 rounded-lg"></div>
            </div>
        );
    }


    return (
        <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card h-full">
            <h3 className="font-medium mb-4">Tendência Mensal</h3>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 10,
                            left: 0,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2}/>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{fontSize: 12, fill: '#888'}}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{fontSize: 12, fill: '#888'}}
                            tickFormatter={(value) => `R$${value}`}
                        />
                        <Tooltip content={<CustomTooltip/>}/>
                        <Legend
                            iconType="circle"
                            wrapperStyle={{paddingTop: 10}}
                        />
                        <Line
                            type="monotone"
                            dataKey="receitas"
                            name="Receitas"
                            stroke="rgba(76, 217, 100, 1)"
                            strokeWidth={2}
                            dot={{r: 4, fill: "rgba(76, 217, 100, 1)"}}
                            activeDot={{r: 6}}
                        />
                        <Line
                            type="monotone"
                            dataKey="despesas"
                            name="Despesas"
                            stroke="rgba(255, 59, 48, 1)"
                            strokeWidth={2}
                            dot={{r: 4, fill: "rgba(255, 59, 48, 1)"}}
                            activeDot={{r: 6}}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyTrendChart;
