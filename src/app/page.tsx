"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function HomePage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p>You are not signed In.</p>
        <a href="/login" className="text-blue-600 underline">
          Go to Login
        </a>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Image src={user.image || ""} alt="avatar" className="w-20 h-20 rounded-full" width={80} height={80} />
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p>Email: {user.email}</p>
      <p className="text-green-600 font-medium">Balance: ${user.balance}</p>
      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
      >
        Sign Out
      </button>
    </div>
  );
}
