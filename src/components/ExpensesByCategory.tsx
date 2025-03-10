
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {Expense, ExpenseVO} from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { fetchCategories } from '@/services/api';

interface ExpensesByCategoryProps {
  expenses: ExpenseVO[];
}

const ExpensesByCategory = ({ expenses }: ExpensesByCategoryProps) => {
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const chartData = useMemo(() => {
    if (!categories.length) return [];
    
    const categoryTotals: { [key: string]: number } = {};
    
    expenses.forEach(expense => {
      if (!categoryTotals[expense.category.id]) {
        categoryTotals[expense.category.id] = 0;
      }
      categoryTotals[expense.category.id] += expense.amount;
    });
    
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      value: categoryTotals[cat.id] || 0,
      color: cat.color,
    })).filter(category => category.value > 0);
  }, [expenses, categories]);

  const totalAmount = useMemo(() => 
    chartData.reduce((total, category) => total + category.value, 0),
    [chartData]
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background shadow-lg rounded-lg p-2 border border-border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-primary">{formatCurrency(data.value)}</p>
          <p className="text-xs text-muted-foreground">
            {((data.value / totalAmount) * 100).toFixed(1)}% do total
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend
  const CustomLegend = () => (
    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-4 text-xs">
      {chartData.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-1"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">
            {entry.name}: {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card border border-border/50 rounded-xl p-4 shadow-card h-full">
      <h3 className="font-medium mb-4">Despesas por Categoria</h3>
      {chartData.length > 0 ? (
        <>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={1}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <CustomLegend />
        </>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-muted-foreground">
          Nenhuma despesa registrada.
        </div>
      )}
    </div>
  );
};

export default ExpensesByCategory;
