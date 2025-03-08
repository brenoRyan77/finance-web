
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import {ExpenseVO} from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { fetchCards } from '@/services/cardService.ts';

interface ExpensesByCardProps {
  expenses: ExpenseVO[];
}

const ExpensesByCard = ({ expenses }: ExpensesByCardProps) => {
  // Buscar cartões da API
  const { data: cards = [] } = useQuery({
    queryKey: ['cards'],
    queryFn: fetchCards
  });

  const chartData = useMemo(() => {
    if (!cards.length) return [];
    
    const cardTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (!cardTotals[expense.card.type]) {
        cardTotals[expense.card.type] = 0;
      }
      cardTotals[expense.card.type] += expense.amount;
    });
    
    return cards.map(card => ({
      name: card.name,
      value: cardTotals[card.type] || 0,
      color: card.color
    })).filter(card => card.value > 0);
  }, [expenses, cards]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background shadow-lg rounded-lg p-2 border border-border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-primary">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card h-full">
      <h3 className="font-medium mb-4">Despesas por Cartão</h3>
      {chartData.length > 0 ? (
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 5,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fill: '#888' }}
                tickFormatter={(value) => `R$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Nenhuma despesa registrada.
        </div>
      )}
    </div>
  );
};

export default ExpensesByCard;
