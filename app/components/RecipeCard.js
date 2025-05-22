"use client";
import Link from "next/link";
export default function RecipeCard({ recipe, onDelete }) {
  return (
    <li className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
      <Link href={`/recipes/${recipe.id}`}>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="mb-2 w-full max-h-48 object-cover rounded"
          />
        )}
        <h2 className="text-xl font-semibold">{recipe.title}</h2>
        <p>{recipe.description}</p>
      </Link>
      <div className="flex justify-between items-center mt-2">
        <Link
          href={`/recipes/edit/${recipe.id}`}
          className="bg-[#F4B400] text-[#3E2F1C] px-3 py-1 rounded hover:bg-[#DFA000]"
        >
          Redigera
        </Link>
        <button
          onClick={() => onDelete(recipe.id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Ta bort
        </button>
      </div>
    </li>
  );
}
