"use client";
import { useState } from "react";
import { auth } from "../services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // Redirect or show success
      window.location.href = "/";
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF8F0]">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded border border-[#E6DCD2] shadow-md w-full max-w-xs flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold mb-4">
          {isLogin ? "Logga in" : "Skapa konto"}
        </h2>
        <input
          type="email"
          placeholder="E-post"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#D64545] text-white py-2 rounded hover:bg-[#B53939] transition"
        >
          {loading ? "Vänta..." : isLogin ? "Logga in" : "Skapa konto"}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline"
        >
          {isLogin
            ? "Inget konto? Skapa ett här"
            : "Har du redan ett konto? Logga in"}
        </button>
      </form>
    </div>
  );
}
