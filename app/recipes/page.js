"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection,query,where,getDocs,doc,deleteDoc } from "firebase/firestore";
import Link from "next/link";
import RecipeCard from "../components/RecipeCard";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchRecipes = async () => {
      setLoading(true);
      const q = query(
        collection(db, "recipes"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      setRecipes(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
      setLoading(false);
    };
    fetchRecipes();
  }, [user]);

  const handleDelete = async (id) => {
    if (confirm("Vill du verkligen ta bort detta recept?")) {
      await deleteDoc(doc(db, "recipes", id));
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Du måste vara inloggad för att se dina recept.</p>
        <Link href="/auth" className="text-blue-600 underline">
          Logga in
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0]">
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Mina recept</h1>
      <Link
        href="/recipes/new"
        className="bg-[#D64545] text-white px-4 py-2 rounded mb-6 inline-block hover:bg-[#B53939]"
      >
        Lägg till nytt recept
      </Link>
      {loading ? (
        <p>Laddar...</p>
      ) : recipes.length === 0 ? (
        <p>Du har inga recept ännu.</p>
      ) : (
        <ul className="space-y-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
