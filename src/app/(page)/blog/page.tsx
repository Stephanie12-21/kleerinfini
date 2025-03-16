"use client";

import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  titre: string;
  contenu: string;
  imageUrl: string | null;
  createdAt: Date;
  categorieArticle: string;
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchArticles = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blog");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles.");
      }
      const data: Article[] = await response.json();
      console.log(data);
      setArticles(data);
    } catch (error) {
      console.error(error);
      setError("Erreur lors de la récupération des articles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSee = (id: string) => {
    router.push(`/blog/${id}`);
  };
  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto mt-8 mb-8">
        <div className="flex flex-col items-center justify-center p-6">
          <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium text-center">
            Chargement des articles en cours...
          </p>
          <p className="text-sm text-muted-foreground text-center mt-2">
            Veuillez patienter quelques instants.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-5xl text-primary font-bold text-center mb-12">
        Blog & Presse
      </h1>
      {error && <p className="text-red-500 text-center mb-8">{error}</p>}
      <div className="mt-8 w-full max-w-3xl">
        <h2 className="text-lg font-semibold mb-4">Liste des articles</h2>
        {articles.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {articles.map((article) => (
              <li
                key={article.id}
                className="border rounded-md shadow-md overflow-hidden"
              >
                <Image
                  src={article.imageUrl || "/placeholder.png"}
                  alt={article.titre}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-md font-bold">{article.titre}</h3>
                  <p className="text-gray-600 text-sm">
                    {article.contenu.slice(0, 100)}...
                  </p>
                </div>
                <div>
                  <span className="block p-4 text-gray-600 text-sm">
                    Publié{" "}
                    {new Date(article.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="block p-4 text-gray-600 text-sm">
                    Catégorie: {article.categorieArticle}
                  </span>
                </div>
                <div className="flex gap-2 p-4">
                  <button
                    onClick={() => handleSee(article.id)}
                    className="block w-full p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                  >
                    Consulter
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun article disponible.</p>
        )}
      </div>
      <div className="mt-12 text-center">
        <Link href="/Blog">
          <button className="hover:bg-primary hover:text-white flex items-center justify-center gap-2">
            Charger d&apos;autres articles
            <ArrowRight className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Blog;
