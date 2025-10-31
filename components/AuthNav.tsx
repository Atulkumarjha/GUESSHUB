"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function AuthNav() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Link href="/profile" className="hover:opacity-70">
      Profile
    </Link>
  );
}
