"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="animate-pulse text-xl">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center max-w-md px-6">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Welcome to GuessHub
          </h1>
          <p className="text-gray-400 mb-8">
            Trade on prediction markets and earn rewards
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
          >
            Sign In to Get Started
          </Link>
        </div>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* User Profile Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-8">
          <div className="flex items-center gap-6">
            <Image
              src={user.image || "/default-avatar.png"}
              alt="avatar"
              className="w-24 h-24 rounded-full ring-4 ring-blue-500/20"
              width={96}
              height={96}
            />
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-2">{user.name}</h2>
              <p className="text-gray-400 mb-3">{user.email}</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Balance:</span>
                <span className="text-2xl font-bold text-green-400">
                  ${user.balance?.toFixed(2) || "0.00"}
                </span>
              </div>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Link
            href="/markets"
            className="group bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-3">📈</div>
            <h3 className="text-xl font-bold mb-2">View Markets</h3>
            <p className="text-blue-100/80">
              Browse and trade on prediction markets
            </p>
          </Link>

          <Link
            href="/portfolio"
            className="group bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-3">💼</div>
            <h3 className="text-xl font-bold mb-2">My Portfolio</h3>
            <p className="text-purple-100/80">
              Track your positions and profits
            </p>
          </Link>

          <Link
            href="/leaderboard"
            className="group bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-xl hover:scale-105 transition-transform"
          >
            <div className="text-4xl mb-3">🏆</div>
            <h3 className="text-xl font-bold mb-2">Leaderboard</h3>
            <p className="text-green-100/80">
              See top traders and rankings
            </p>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          <h3 className="text-2xl font-bold mb-6">Quick Stats</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {user.balance ? (user.balance / 1000).toFixed(1) + "K" : "0"}
              </div>
              <div className="text-gray-400">Available Balance</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-3xl font-bold text-purple-400 mb-2">-</div>
              <div className="text-gray-400">Active Positions</div>
            </div>
            <div className="text-center p-6 bg-gray-900/50 rounded-xl">
              <div className="text-3xl font-bold text-green-400 mb-2">-</div>
              <div className="text-gray-400">Total P&L</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
