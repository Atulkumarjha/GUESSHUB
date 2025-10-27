"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">LOGIN</h1>
      <button
        onClick={() => signIn("google")}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        SIGN IN WITH GOOGLE
      </button>
    </div>
  );
}
