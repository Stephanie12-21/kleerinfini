"use client";

import Image from "next/image";
import { ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ImageData {
  path: string;
}

interface Article {
  id: string;
  titre: string;
  contenu: string;
  createdAt: string;
  updatedAt: string;
  categorieArticle: string;
  images?: ImageData[];
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchArticles = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/blog");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des articles.");
      }
      const data: Article[] = await response.json();
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
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <div
            key={article.id}
            className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-0">
              <div className="relative h-48 md:h-64">
                {article.images?.length ? (
                  <Image
                    src={article.images[0].path}
                    alt={article.titre}
                    layout="fill"
                    objectFit="cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <p className="text-gray-500">Aucune image disponible</p>
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground p-2 rounded">
                  {article.categorieArticle}
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-primary mb-2 line-clamp-2">
                  {article.titre}
                </h2>
                <p className="text-base text-muted-foreground mb-4">
                  {article.createdAt === article.updatedAt
                    ? `Publié le ${new Date(
                        article.createdAt
                      ).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`
                    : `Modifié le ${new Date(
                        article.updatedAt
                      ).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}`}
                </p>
                <p className="text-base text-muted-foreground mb-4 line-clamp-3">
                  {article.contenu}
                </p>
                <Link href={`/Blog/InfoBlog/${article.id}`}>
                  <button className="w-full hover:bg-primary hover:text-white flex items-center justify-center gap-2">
                    Lire l&apos;article
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
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
