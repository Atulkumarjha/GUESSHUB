"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-md w-full px-6">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            GuessHub
          </h1>
          <p className="text-xl text-gray-400 mb-2">
            Prediction Markets, Reimagined
          </p>
          <p className="text-sm text-gray-500">
            Trade on outcomes, earn rewards, compete globally
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
          
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105 font-medium shadow-lg"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By signing in, you agree to our</p>
            <p className="mt-1">
              <span className="text-blue-400 hover:underline cursor-pointer">
                Terms of Service
              </span>
              {" and "}
              <span className="text-blue-400 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
            <span>🔒 Secure</span>
            <span>⚡ Fast</span>
            <span>🌍 Global</span>
          </div>
        </div>
      </div>
    </div>
  );
}
