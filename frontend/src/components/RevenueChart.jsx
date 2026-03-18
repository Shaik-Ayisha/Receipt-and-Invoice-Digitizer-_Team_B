import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

const data = [
  { date: "Jan", revenue: 36000 },
  { date: "Feb", revenue: 25000 },
  { date: "Mar", revenue: 15000 },
  { date: "Apr", revenue: 9000 },
  { date: "May", revenue: 7000 }
];

export default function RevenueChart() {

  return (
    <div className="bg-white p-6 rounded shadow">

    

      <LineChart width={700} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date"/>
        <YAxis/>
        <Tooltip/>

        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={3}
        />

      </LineChart>

    </div>
  );
}