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
    <div className="max-w-4xl mx-auto p-10 bg-white rounded shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ruta 1: Bild */}
        <div className="rounded overflow-hidden flex items-center justify-center bg-gray-100 min-h-[200px]">
          {recipe.imageUrl && (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="object-cover rounded w-full max-h-72"
            />
          )}
        </div>
        {/* Ruta 2: Portioner & tid */}
        <div className="flex flex-col justify-center h-full p-4 bg-gray-50 rounded">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <div className="text-gray-700 mb-2">
            <span className="font-semibold">Tillagningstid:</span>{" "}
            {recipe.cookingTime || "-"}
            <br />
            <span className="font-semibold">Portioner:</span>{" "}
            {recipe.servings || "-"}
          </div>
        </div>
        {/* Ruta 3: Ingredienser */}
        <div className="bg-gray-50 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Ingredienser</h2>
          <ul className="list-disc list-inside">
            {(recipe.ingredients || "")
              .split("\n")
              .filter(Boolean)
              .map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
          </ul>
        </div>
        {/* Ruta 4: Beskrivning */}
        <div className="bg-gray-50 rounded p-4">
          <h2 className="text-xl font-semibold mb-2">Beskrivning</h2>
          <p>{recipe.description}</p>
        </div>
      </div>
      <Link
        href="/recipes"
        className="mt-8 inline-block bg-[#D64545] text-white px-4 py-2 rounded hover:bg-[#B53939]"
      >
        Tillbaka
      </Link>
    </div>
  );
}
