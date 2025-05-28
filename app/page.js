"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import Image from "next/image";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen gap-8 p-8 relative">
      <Image
        src="/räka.png"
        alt="Bakgrund"
        fill
        className="object-cover -z-10"
        quality={100}
      />
      <div className="mt-16" />
      <h1 className="text-5xl text-[#D64545] font-bold">CookNest</h1>
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
            <Link
              href="/recipes/new"
              className="bg-[#D64545] text-white px-4 py-2 rounded hover:bg-[#B53939]"
            >
              Lägg till nytt recept
            </Link>
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
