"use client";

import {
  Edit2Icon,
  PlusCircle,
  SaveIcon,
  XIcon,
  LogOutIcon,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Article {
  id: string;
  titre: string;
  contenu: string;
  imageUrl: string | null;
  createdAt: Date;
  categorieArticle: string;
}

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "/pdp.png");
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/blog");
        if (!response.ok) throw new Error("Erreur lors du chargement");
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Erreur de chargement des articles:", error);
      }
    };

    fetchArticles();
  }, [session?.user]);

  const handleGoLogin = () => router.push("/login");

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        <p>Connexion requise</p>
        <p className="text-gray-600">Veuillez vous connecter pour continuer</p>
        <button
          onClick={handleGoLogin}
          className="py-2 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm md:text-base"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const handleEditClick = () => setIsEditing(!isEditing);
  const handleSave = () => {
    console.log(
      "Nouveau nom:",
      name,
      "Nouvel email:",
      email,
      "Nouvelle image:",
      image
    );
    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSee = (id: string) => {
    router.push(`/admin/blog/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/blog/editblog/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      const data = await response.json();
      console.log("Suppression réussie:", data);
      setArticles((prev) => prev.filter((article) => article.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
      <Image
        src={image}
        alt="User profile"
        width={80}
        height={80}
        className="w-[80px] h-[80px] rounded-full border-2 border-indigo-600 object-cover"
      />

      {isEditing ? (
        <div className="flex flex-col mt-4 space-y-2 w-full max-w-sm">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border rounded-md w-full"
            placeholder="Nom"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded-md w-full"
            placeholder="Email"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded-md w-full"
          />
        </div>
      ) : (
        <div className="flex flex-col mt-4 text-center">
          <span className="font-bold text-lg">
            Bienvenue <span className="text-orange-500">{name}</span>
          </span>
          <span className="text-gray-600 text-sm">{email}</span>
        </div>
      )}

      <div className="flex items-center mt-5 gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-3 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              <SaveIcon />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              <XIcon />
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Edit2Icon />
          </button>
        )}

        <button
          onClick={handleSignOut}
          className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          <LogOutIcon />
        </button>
      </div>

      <button
        onClick={() => router.push("/admin/blog/addblog")}
        className="flex items-center gap-2 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors mt-4"
      >
        <PlusCircle className="w-5 h-5" />
        <span>Ajouter un nouvel article</span>
      </button>

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
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="block w-full p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="block w-full p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Aucun article disponible.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
