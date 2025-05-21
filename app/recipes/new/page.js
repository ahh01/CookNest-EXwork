"use client";
import { useState, useEffect } from "react";
import { db, auth, storage } from "../../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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
          placeholder="Beskrivning"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={uploading}
          className="bg-[#D64545] text-white px-4 py-2 rounded hover:bg-[#B53939]"
        >
          {uploading ? "Laddar upp..." : "Spara recept"}
        </button>
      </form>
    </div>
  );
}
