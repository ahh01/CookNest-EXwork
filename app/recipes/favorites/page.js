"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../../services/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchFavorites = async () => {
      setLoading(true);
      const favQuery = query(
        collection(db, "favorites"),
        where("userId", "==", user.uid)
      );
      const favSnapshot = await getDocs(favQuery);
      const recipeIds = favSnapshot.docs.map((doc) => ({
        recipeId: doc.data().recipeId,
        favId: doc.id,
      }));

      const recipes = [];
      for (const { recipeId, favId } of recipeIds) {
        const recipeRef = doc(db, "recipes", recipeId);
        const recipeSnap = await getDoc(recipeRef);
        if (recipeSnap.exists()) {
          recipes.push({ id: recipeSnap.id, favId, ...recipeSnap.data() });
        }
      }
      setFavorites(recipes);
      setLoading(false);
    };
    fetchFavorites();
  }, [user]);

  const handleRemoveFavorite = async (favId) => {
    await deleteDoc(doc(db, "favorites", favId));
    setFavorites(favorites.filter((fav) => fav.favId !== favId));
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Du måste vara inloggad för att se dina favoriter.</p>
        <Link href="/auth" className="text-blue-600 underline">
          Logga in
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mina favoriter</h1>
      </div>
      {loading ? (
        <p>Laddar...</p>
      ) : favorites.length === 0 ? (
        <p>Du har inga favoritrecept ännu.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {favorites.map((recipe) => (
              <li
                key={recipe.id}
                className="p-4 bg-white rounded shadow flex flex-col md:flex-row gap-4 items-center"
              >
                {recipe.imageUrl && (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="w-full h-40 md:w-24 md:h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1 w-full">
                  <Link href={`/recipes/${recipe.id}`}>
                    <h2 className="text-xl font-semibold">{recipe.title}</h2>
                    {recipe.description.split(" ").slice(0, 10).join(" ")}
                    {recipe.description.split(" ").length > 10 && "..."}
                  </Link>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(recipe.favId)}
                  className=" bg-[#D64545] text-white px-3 py-1 rounded hover:bg-[#B53939] w-full md:w-auto"
                >
                  Ta bort
                </button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end mt-8">
            <button
              onClick={() => router.back()}
              className="flex items-center bg-[#E0D9D2] px-4 py-2 rounded hover:bg-[#CFC6BD]"
              type="button"
            >
              Tillbaka
            </button>
          </div>
        </>
      )}
    </div>
  );
}
