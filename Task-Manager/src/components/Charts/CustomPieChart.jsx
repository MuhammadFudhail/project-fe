import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip"; // pastikan file ini ada
import CustomLegend from "./CustomLegend";    

const CustomPieChart = ({ data, colors }) => {
  const chartData = Array.isArray(data) ? data : [];

  console.log("CustomPieChart received data:", chartData);

  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={80}
          labelLine={false}
          // label={({ name, percent }) =>
          //   `${name} (${(percent * 100).toFixed(0)}%)`
          // }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip 
          // content={<CustomTooltip />} 
        />
        <Legend 
          // content={<CustomLegend />} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
