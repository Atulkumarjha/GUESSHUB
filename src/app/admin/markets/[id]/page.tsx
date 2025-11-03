import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import connectDB from "../../../../../lib/db";
import Market from "../../../../../lib/models/market";
import { authOptions } from "../../../../../lib/auth-options";

export default async function AdminResolvePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await connectDB();

  const market = await Market.findById(params.id);

  if (!market) {
    return <div>Market not found</div>;
  }

  return (
    <div className="max-w-xl mx-auto mt-12 p-6">
      <h1 className="text-xl font-bold">Resolve Market</h1>
      <p className="opacity-60">{market.tittle}</p>

      <div className="mt-6 space-x-4">
        <form action={`/api/markets/${market._id}/resolve`} method="POST">
          <button
            name="winner"
            value="yes"
            className="bg-green-600 px-4 py-2 rounded-lg"
          >
            Resolve YES
          </button>
          <button
            name="winner"
            value="no"
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Resolve NO
          </button>
        </form>
      </div>
    </div>
  );
}
