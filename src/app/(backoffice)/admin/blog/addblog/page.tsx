"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ArticleForm: React.FC = () => {
  const [titre, setTitre] = useState<string>("");
  const [contenu, setContenu] = useState<string>("");
  const [categorieArticle, setCategorieArticle] = useState<string>("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const router = useRouter();

  const resetForm = () => {
    setTitre("");
    setContenu("");
    setCategorieArticle("");
    setImageFiles([]);
  };

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files);
        setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
      }
    },
    []
  );

  const removeImage = useCallback((index: number) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!titre || !contenu || !categorieArticle) {
      alert("Tous les champs doivent être remplis.");
      return;
    }

    const formData = new FormData();
    formData.append("titre", titre);
    formData.append("contenu", contenu);
    formData.append("categorieArticle", categorieArticle);

    imageFiles.forEach((file: File) => {
      formData.append("images", file);
    });

    console.log("Les données envoyées :", {
      titre,
      contenu,
      categorieArticle,
      imageFiles,
    });

    try {
      const response = await fetch("/api/blog", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Article ajouté avec succès !");
        resetForm();
        setTimeout(() => {
          router.push("/admin/blog");
        }, 5000);
      } else {
        alert("Erreur lors de l'ajout de l'article.");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la soumission :", error);
    }
  };

  return (
    <div className="max-w-6xl container mx-auto px-4 py-8 bg-white shadow-xl my-5 rounded-lg">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Ajouter un nouvel article
      </h1>

      <form onSubmit={handleSubmit} className="flex-col space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="titre" className="block text-base font-medium">
                Titre
              </label>
              <input
                type="text"
                id="titre"
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                required
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="categorieArticle"
                className="block text-base font-medium"
              >
                Catégorie
              </label>
              <input
                type="text"
                id="categorieArticle"
                value={categorieArticle}
                onChange={(e) => setCategorieArticle(e.target.value)}
                required
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="imageFiles"
                className="block text-base font-medium"
              >
                Choisir des images
              </label>
              <input
                type="file"
                id="imageFiles"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mt-2 cursor-pointer"
              />
            </div>

            {imageFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Images sélectionnées :
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {imageFiles.map((file, index) => {
                    const fileURL = URL.createObjectURL(file);

                    return (
                      <div key={index} className="relative group">
                        <Image
                          src={fileURL}
                          alt={`Image ${index + 1}`}
                          width={100}
                          height={70}
                          className="w-28 h-20 object-cover rounded"
                          onLoad={() => URL.revokeObjectURL(fileURL)}
                        />
                        <button
                          type="button"
                          aria-label="Supprimer l'image"
                          role="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="contenu" className="block text-base font-medium">
                Contenu
              </label>
              <textarea
                id="contenu"
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                required
                rows={6}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition focus:outline-none"
              ></textarea>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full mt-6">
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition hover:bg-indigo-700"
          >
            Ajouter le nouvel article
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
