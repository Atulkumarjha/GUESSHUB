"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

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
      <Image
        src={user.image || ""}
        alt="avatar"
        className="w-20 h-20 rounded-full"
        width={80}
        height={80}
      />
      <h2 className="text-2xl font-semibold">{user.name}</h2>
      <p>Email: {user.email}</p>
      <p className="text-green-600 font-medium">Balance: ${user.balance}</p>

      <div className="flex gap-4 mt-6">
        <Link
          href="/markets"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Markets
        </Link>
        <Link
          href="/markets"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          Buy Shares
        </Link>
      </div>

      <button
        onClick={() => signOut()}
        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 mt-4"
      >
        Sign Out
      </button>
    </div>
  );
}
