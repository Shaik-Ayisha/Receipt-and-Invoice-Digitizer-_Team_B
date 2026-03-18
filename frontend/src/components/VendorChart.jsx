import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Anderson", value: 400 },
  { name: "Carrillo", value: 300 },
  { name: "Hoffman", value: 200 },
  { name: "Wood", value: 150 }
];

const COLORS = ["#6366f1","#22c55e","#f97316","#ef4444"];

export default function VendorChart(){

  return (
    <div className="bg-white p-6 rounded shadow">

      

      <PieChart width={400} height={300}>

        <Pie
          data={data}
          dataKey="value"
          innerRadius={60}
          outerRadius={100}
        >

          {data.map((entry,index)=>(
            <Cell key={index} fill={COLORS[index]} />
          ))}

        </Pie>

        <Tooltip/>

      </PieChart>

    </div>
  );
}