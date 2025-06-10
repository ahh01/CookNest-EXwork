"use client";
import Link from "next/link";
import FavoriteButton from "./FavoriteButton";

export default function RecipeCard({
  recipe,
  onDelete,
  userId,
  isFavorite,
  onFavoriteChange,
}) {
  return (
    <li className="p-4 bg-white rounded shadow hover:bg-gray-50 transition flex flex-col h-full">
      <Link href={`/recipes/${recipe.id}`}>
        {recipe.imageUrl && (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="mb-2 w-full max-h-48 object-cover rounded"
          />
        )}
        <h2 className="text-xl font-semibold">{recipe.title}</h2>
        <p>
          {recipe.description.length > 80
            ? recipe.description.slice(0, 80) + "..."
            : recipe.description}
        </p>
      </Link>
      <div className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center gap-2">
          <FavoriteButton
            recipeId={recipe.id}
            userId={userId}
            isFavorite={isFavorite}
            onChange={onFavoriteChange}
          />
        </div>
        <button
          onClick={() => onDelete(recipe.id)}
          className="bg-[#D64545] text-white px-3 py-1 rounded hover:bg-[#B53939]"
        >
          Ta bort
        </button>
      </div>
    </li>
  );
}
