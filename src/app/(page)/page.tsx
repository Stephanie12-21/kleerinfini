"use client";

import type React from "react";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";

export default function Home() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const emailSchema = z
    .string()
    .email("L'email doit être valide.")
    .refine(
      (email) =>
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,7}$/.test(email),
      {
        message: "L'email ne respecte pas le format requis.",
      }
    );

  const handleSubmit = async () => {
    try {
      emailSchema.parse(email);
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Vous êtes bien abonné à la newsletter !");
        setEmail("");
      } else if (response.status === 409) {
        alert("Vous êtes déjà abonné avec cet email.");
        setEmail("");
      } else {
        setErrorMessage("Erreur lors de l'abonnement. Essayez à nouveau.");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrorMessage(error.errors[0].message);
      } else {
        console.error("Erreur réseau :", error);
        setErrorMessage("Une erreur s'est produite. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleBlogPage = () => {
    router.push("/blog");
  };

  const handleBackoffice = () => {
    router.push("/admin");
  };

  const handleContactPage = () => {
    router.push("/contact");
  };

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Home</h1>
      <p className="text-base md:text-lg text-center mb-6">
        Bienvenue sur le site de Kleer Infini
      </p>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl mb-8">
        <button
          onClick={handleBlogPage}
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors w-full text-sm md:text-base"
        >
          Voir le blog
        </button>
        <button
          onClick={handleBackoffice}
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors w-full text-sm md:text-base"
        >
          Aller au backoffice
        </button>
        <button
          onClick={handleContactPage}
          className="p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors w-full text-sm md:text-base"
        >
          Contact
        </button>
      </div>

      <div className="w-full max-w-md space-y-4 md:space-y-5">
        <h2 className="text-xl md:text-2xl font-semibold text-center">
          Newsletter
        </h2>
        <p className="text-center text-sm md:text-base">
          S&apos;abonner à notre newsletter:
        </p>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="border border-gray-300 rounded-md p-2 flex-grow w-full"
            placeholder="Votre email"
            disabled={loading}
          />
          <button
            onClick={handleSubmit}
            className="py-2 px-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors whitespace-nowrap text-sm md:text-base"
            disabled={loading}
          >
            {loading ? "Chargement..." : "S'abonner"}
          </button>
        </div>

        {errorMessage && (
          <div className="text-red-500 text-center text-sm md:text-base">
            <p>{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-8 text-center text-[#71717A] text-xs sm:text-sm md:text-base">
        © {currentYear} Conçu par{" "}
        <span className="text-[#2b7fff] font-semibold">Kleer Infini</span>
      </div>
    </div>
  );
}
