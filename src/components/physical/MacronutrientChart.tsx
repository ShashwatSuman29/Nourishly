
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface MacronutrientChartProps {
  protein: number;
  carbs: number;
  fat: number;
}

const MacronutrientChart = ({ protein, carbs, fat }: MacronutrientChartProps) => {
  // Convert to calories (protein: 4 cal/g, carbs: 4 cal/g, fat: 9 cal/g)
  const proteinCalories = protein * 4;
  const carbsCalories = carbs * 4;
  const fatCalories = fat * 9;
  
  const total = proteinCalories + carbsCalories + fatCalories;
  
  const data = [
    { name: 'Protein', value: proteinCalories, color: '#6366f1' },
    { name: 'Carbs', value: carbsCalories, color: '#a855f7' },
    { name: 'Fat', value: fatCalories, color: '#ec4899' }
  ];
  
  const renderTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const percentage = ((item.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-border">
          <p className="font-medium">{item.name}</p>
          <p className="text-sm text-muted-foreground">
            {item.value.toFixed(0)} calories ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };
  
  const calculatePercentage = (value: number) => {
    return total === 0 ? 0 : Math.round((value / total) * 100);
  };

  return (
    <div className="bg-muted/50 rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4">Macronutrient Breakdown</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6366f1]" />
            <p className="font-medium">Protein</p>
          </div>
          <p className="text-sm text-muted-foreground">{calculatePercentage(proteinCalories)}%</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#a855f7]" />
            <p className="font-medium">Carbs</p>
          </div>
          <p className="text-sm text-muted-foreground">{calculatePercentage(carbsCalories)}%</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ec4899]" />
            <p className="font-medium">Fat</p>
          </div>
          <p className="text-sm text-muted-foreground">{calculatePercentage(fatCalories)}%</p>
        </div>
      </div>
    </div>
  );
};

export default MacronutrientChart;
