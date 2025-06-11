"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { db, storage } from "../../../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function EditRecipePage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    ingredients: "",
    cookingTime: "",
    servings: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const refDoc = doc(db, "recipes", id);
        const snap = await getDoc(refDoc);
        if (snap.exists()) {
          const data = snap.data();
          setForm({
            title: data.title || "",
            description: data.description || "",
            imageUrl: data.imageUrl || "",
            ingredients: data.ingredients || "",
            cookingTime: data.cookingTime || "",
            servings: data.servings || "",
          });
        } else {
          setError("Receptet kunde inte hittas.");
        }
      } catch (err) {
        setError("Fel vid hämtning av recept.");
      }
      setLoading(false);
    };
    if (id) fetchRecipe();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.imageUrl;
      if (image) {
        const imageRef = ref(
          storage,
          `recipes/${id}/${Date.now()}_${image.name}`
        );
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
      await updateDoc(doc(db, "recipes", id), {
        ...form,
        imageUrl,
      });
      router.push(`/recipes/${id}`);
    } catch {
      setError("Kunde inte spara ändringar.");
    }
  };

  if (loading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Redigera recept</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Titel</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">
            Ingredienser (en per rad)
          </label>
          <textarea
            name="ingredients"
            value={form.ingredients}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Tillagningstid</label>
          <input
            name="cookingTime"
            value={form.cookingTime}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Portioner</label>
          <input
            name="servings"
            value={form.servings}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Beskrivning</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">Nuvarande bild</label>
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Nuvarande bild"
              className="mb-2 w-full max-h-48 object-cover rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex gap-4 justify-between">
          <button
            type="submit"
            className="bg-[#718355] text-white px-4 py-2 rounded hover:bg-[#5C6C47]"
          >
            Spara ändringar
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center bg-[#E0D9D2] px-4 py-2 rounded hover:bg-[#CFC6BD]"
          >
            Tillbaka
          </button>
        </div>
      </form>
    </div>
  );
}
