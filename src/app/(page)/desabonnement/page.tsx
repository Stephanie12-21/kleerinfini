"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Unsubscribe = () => {
  const router = useRouter();
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    const interval: NodeJS.Timeout = setInterval(() => {
      setDots((prev: string) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleUnsubscribe = async () => {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const token = urlSearchParams.get("token");

      if (!token) return;

      try {
        const response = await fetch(
          `/api/newsletter/unsubscribe?token=${token}`,
          {
            method: "GET",
          }
        );

        if (response.ok) {
          setTimeout(() => {
            router.push("/");
          }, 3000);
        } else {
          console.error("Erreur lors du désabonnement");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
      }
    };

    handleUnsubscribe();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center">
          Désabonnement confirmé
        </h2>
        <p className="text-center text-gray-600">
          Vous n&apos;êtes plus abonné à la newsletter de Kleer Infini.
        </p>
        <p className="mt-2 text-center text-base text-gray-500">
          Vous allez être redirigé vers la page d&apos;accueil dans quelques
          secondes
          <span className="inline-block w-8 text-left">{dots}</span>
        </p>
      </div>
    </div>
  );
};

export default Unsubscribe;
