"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../services/firebase";
import Link from "next/link";

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, "recipes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecipe({ id: docSnap.id, ...docSnap.data() });
      }
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <div className="p-8">Laddar...</div>;
  if (!recipe) return <div className="p-8">Receptet hittades inte.</div>;

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded shadow">
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="mb-4 w-full max-h-64 object-cover rounded"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
      <div className="mb-2 text-gray-700">
        <span className="font-semibold">Tillagningstid:</span>{" "}
        {recipe.cookingTime || "-"}
        <br />
        <span className="font-semibold">Portioner:</span>{" "}
        {recipe.servings || "-"}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Ingredienser:</span>
        <ul className="list-disc list-inside">
          {(recipe.ingredients || "")
            .split("\n")
            .filter(Boolean)
            .map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
        </ul>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Beskrivning:</span>
        <p>{recipe.description}</p>
      </div>
      <Link
        href="/recipes"
        className="bg-[#D64545] text-white px-4 py-2 rounded mb-6 inline-block hover:bg-[#B53939]"
      >
        Tillbaka
      </Link>
    </div>
  );
}
