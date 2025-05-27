"use client";
import { useState } from "react";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function FavoriteButton({
  recipeId,
  userId,
  isFavorite,
  onChange,
}) {
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    const favQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    );
    const favSnapshot = await getDocs(favQuery);
    if (favSnapshot.empty) {
      await addDoc(collection(db, "favorites"), { userId, recipeId });
      if (onChange) onChange(true);
    }
    setLoading(false);
  };

  const handleRemove = async () => {
    setLoading(true);
    const favQuery = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("recipeId", "==", recipeId)
    );
    const favSnapshot = await getDocs(favQuery);
    favSnapshot.forEach(async (docu) => {
      await deleteDoc(docu.ref);
    });
    if (onChange) onChange(false);
    setLoading(false);
  };

  if (!userId) return null;

  return isFavorite ? (
    <button
      onClick={handleRemove}
      disabled={loading}
      title="Ta bort från favoriter"
      className="text-red-500 text-2xl hover:text-red-700 bg-transparent border-0 p-0 cursor-pointer"
      type="button"
    >
      <MdFavorite />
    </button>
  ) : (
    <button
      onClick={handleAdd}
      disabled={loading}
      title="Lägg till i favoriter"
      className="text-gray-400 text-2xl hover:text-red-500 bg-transparent border-0 p-0 cursor-pointer"
      type="button"
    >
      <MdFavoriteBorder />
    </button>
  );
}
