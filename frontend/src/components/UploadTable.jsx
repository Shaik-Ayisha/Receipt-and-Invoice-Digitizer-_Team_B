export default function UploadTable(){

const uploads = [
  {
    file:"upload1.pdf",
    vendor:"Carrillo, Lara and Hooper",
    date:"02/04/2018",
    amount:"$480.00",
    status:"Processed"
  },
  {
    file:"upload2.pdf",
    vendor:"Wood Inc",
    date:"01/03/2018",
    amount:"$96.00",
    status:"Processed"
  },
  {
    file:"upload3.pdf",
    vendor:"Hall-Martinez",
    date:"12/04/2017",
    amount:"$405.95",
    status:"Processed"
  }
];

return(

<div className="bg-white p-6 rounded shadow mt-8">

<h2 className="text-lg font-semibold mb-4">
Recent Uploads
</h2>

<table className="w-full">

<thead className="bg-gray-100">

<tr>
<th className="p-3 text-left">File</th>
<th>Vendor</th>
<th>Date</th>
<th>Amount</th>
<th>Status</th>
</tr>

</thead>

<tbody>

{uploads.map((item,index)=>(
<tr key={index} className="border-t">

<td className="p-3">{item.file}</td>
<td>{item.vendor}</td>
<td>{item.date}</td>
<td>{item.amount}</td>
<td className="text-green-500">{item.status}</td>

</tr>
))}

</tbody>

</table>

</div>

);
}