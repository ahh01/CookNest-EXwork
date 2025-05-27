"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "../services/firebase";
import { MdFavoriteBorder } from "react-icons/md";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <nav className="w-full bg-[#D64545] text-white px-6 py-3 flex justify-between items-center shadow">
      <Link href="/" className="font-bold text-xl">
        CookNest
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/recipes/favorites">
          <MdFavoriteBorder className="inline-block text-2xl hover:text-red-900" />
        </Link>
        {user ? (
          <button
            onClick={() => auth.signOut()}
            className="bg-white text-[#D64545] px-3 py-1 rounded hover:bg-gray-200"
          >
            Logga ut
          </button>
        ) : (
          <Link
            href="/auth"
            className="bg-white text-[#D64545] px-3 py-1 rounded hover:bg-gray-200"
          >
            Logga in
          </Link>
        )}
      </div>
    </nav>
  );
}
