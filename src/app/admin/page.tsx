import connectDB from "../../../lib/db";
import Market from "../../../lib/models/market";

export default function AdminPage() {
  await connectDB();

  const markets = await Market.find().lean();

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 space-y-4">
      <h1 className="text-xl font-bold">Admin Panel</h1>

      {markets.map((m: any) => (
        <a
          key={m.id}
          href={`/admin/markets/${m._id}`}
          className="block bg-gray-900 p-4 rounded-lg"
        >
          {m.title} - {m.status}
        </a>
      ))}
    </div>
  );
}
