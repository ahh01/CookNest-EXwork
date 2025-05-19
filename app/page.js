"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 bg-[#FFF8F0]">
      <h1 className="text-3xl font-bold">CookNest</h1>
      <p className="text-lg text-center max-w-xl">
        Spara, organisera och hitta dina favoritrecept. Skapa konto, logga in
        och börja samla dina bästa matupplevelser!
      </p>
      <div className="flex gap-4">
        {user ? (
          <>
            <Link
              href="/recipes"
              className="bg-[#D64545] text-white px-4 py-2 rounded hover:bg-[#B53939]"
            >
              Mina recept
            </Link>
            <button
              onClick={() => auth.signOut()}
              className="bg-[#D64545] text-white px-4 py-2 rounded hover:bg-[#B53939]"
            >
              Logga ut
            </button>
          </>
        ) : (
          <Link
            href="/auth"
            className="bg-[#D64545] text-white px-4 py-2 rounded-2xl hover:bg-[#B53939] transition"
          >
            Logga in / Skapa konto
          </Link>
        )}
      </div>
    </div>
  );
}
