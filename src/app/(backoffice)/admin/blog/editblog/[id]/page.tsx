"use client";

import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, X } from "lucide-react";

interface Article {
  titre: string;
  contenu: string;
  categorieArticle: string;
}

interface FormData {
  titre: string;
  contenu: string;
  categorieArticle: string;
  files: File[];
}

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
}

const ArticleDetailPageModif: React.FC<Props> = ({ params }) => {
  const [id, setId] = useState<string | null>(null);
  const [article, setArticle] = useState<Article | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    titre: "",
    contenu: "",
    categorieArticle: "",
    files: [],
  });

  const router = useRouter();

  useEffect(() => {
    params.then((unwrappedParams) => {
      setId(unwrappedParams.id);
    });
  }, [params]);

  const fetchArticle = async (id: string): Promise<Article> => {
    try {
      const response = await fetch(`/api/blog/${id}`);
      if (!response.ok) {
        throw new Error("Article non trouvé");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de l'article:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id)
        .then((data) => {
          setArticle(data);
          setFormData({
            titre: data.titre,
            contenu: data.contenu,
            categorieArticle: data.categorieArticle,
            files: [],
          });
        })
        .catch((err) => setError(err.message));
    }
  }, [id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files) {
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...Array.from(files)],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      contenu: "",
      categorieArticle: "",
      files: [],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("titre", formData.titre);
    formDataToSend.append("contenu", formData.contenu);
    formDataToSend.append("categorieArticle", formData.categorieArticle);
    formData.files.forEach((file) => {
      formDataToSend.append("files", file);
    });

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de l'article");
      }
      alert("Article modifié avec succès !");

      resetForm();

      setTimeout(() => {
        router.push("/admin/");
      }, 5000);
    } catch (error) {
      alert("Erreur lors de la mise à jour de l'article");
      console.error("Erreur lors de la soumission :", error);
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!article) {
    return (
      <div className="w-full max-w-md mx-auto mt-8">
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium text-center">
            Chargement de l&apos;article en cours...
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Veuillez patienter quelques instants.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl container  mx-auto px-4 py-8 bg-white shadow-md my-5 rounded-lg">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Modifier l&apos;article
      </h1>
      <div className="flex-col space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="titre"
                className="block text-lg font-medium text-gray-700"
              >
                Titre de l&apos;article
              </label>
              <input
                type="text"
                id="titre"
                name="titre"
                value={formData.titre}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="categorieArticle"
                className="block text-lg font-medium text-gray-700"
              >
                Catégorie de l&apos;article
              </label>
              <input
                type="text"
                id="categorieArticle"
                name="categorieArticle"
                value={formData.categorieArticle}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="contenu"
                className="block text-sm font-medium text-gray-700"
              >
                Contenu
              </label>
              <textarea
                id="contenu"
                name="contenu"
                value={formData.contenu}
                onChange={handleChange}
                required
                rows={6}
                className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition focus:outline-none"
              ></textarea>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="files"
                className="block text-lg font-medium text-gray-700"
              >
                Images de l&apos;article
              </label>
              <input
                type="file"
                id="files"
                accept="image/*"
                multiple
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            {formData.files.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Images sélectionnées :
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {formData.files.map((file, index) => {
                    const fileURL = URL.createObjectURL(file);

                    return (
                      <div key={index} className="relative group">
                        <Image
                          src={fileURL}
                          alt={`Image ${index + 1}`}
                          width={100}
                          height={70}
                          className="w-28 h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                          onClick={() => handleRemoveImage(index)}
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
        </div>

        <div className="space-y-3">
          <div className="flex justify-between w-full space-x-9">
            <button
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition hover:bg-indigo-700"
              onClick={handleSubmit}
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPageModif;
