"use client";
import { useState, useEffect } from "react";
import { db, auth, storage } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import { PiKeyReturn } from "react-icons/pi";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [servings, setServings] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("Du måste vara inloggad.");
      return;
    }
    if (!title) {
      setError("Titel är obligatoriskt.");
      return;
    }
    setUploading(true);
    let imageUrl = "";
    try {
      if (image) {
        const imageRef = ref(
          storage,
          `recipes/${user.uid}/${Date.now()}_${image.name}`
        );
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
      await addDoc(collection(db, "recipes"), {
        title,
        description,
        ingredients,
        cookingTime,
        servings,
        imageUrl,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      router.push("/recipes");
    } catch (err) {
      setError("Kunde inte spara receptet.");
    }
    setUploading(false);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>Du måste vara inloggad för att lägga till recept.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Lägg till nytt recept</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Titel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded"
          required
        />
        <textarea
          placeholder="Ingredienser (en per rad)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="border p-2 rounded"
          rows={4}
        />
        <input
          type="text"
          placeholder="Tillagningstid (t.ex. 30 min)"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Antal portioner"
          value={servings}
          onChange={(e) => setServings(e.target.value)}
          className="border p-2 rounded"
        />
        <textarea
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <label className="font-semibold mt-2" htmlFor="image-upload">
          Lägg till bild
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-4 justify-between">
          <button
            type="submit"
            disabled={uploading}
            className="bg-[#718355] text-white px-4 py-2 rounded hover:bg-[#5C6C47]"
          >
            {uploading ? "Laddar upp..." : "Spara recept"}
          </button>
          <button
            onClick={() => router.back()}
            className="flex items-center bg-[#E0D9D2] px-4 py-2 rounded hover:bg-[#CFC6BD]"
            type="button"
          >
            Tillbaka
          </button>
        </div>
      </form>
    </div>
  );
}
