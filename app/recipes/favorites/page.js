"use client";
import { useEffect, useState } from "react";
import { db, auth } from "../../services/firebase";
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from "firebase/firestore";
import Link from "next/link";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      const recipeIds = favSnapshot.docs.map(doc => ({
        recipeId: doc.data().recipeId,
        favId: doc.id
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
    setFavorites(favorites.filter(fav => fav.favId !== favId));
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
      <h1 className="text-2xl font-bold mb-4">Mina favoriter</h1>
      {loading ? (
        <p>Laddar...</p>
      ) : favorites.length === 0 ? (
        <p>Du har inga favoritrecept ännu.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map(recipe => (
            <li key={recipe.id} className="p-4 bg-white rounded shadow flex gap-4 items-center">
              {recipe.imageUrl && (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <Link href={`/recipes/${recipe.id}`}>
                  <h2 className="text-xl font-semibold">{recipe.title}</h2>
                  <p>{recipe.description}</p>
                </Link>
              </div>
              <button
                onClick={() => handleRemoveFavorite(recipe.favId)}
                className="ml-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Ta bort
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}