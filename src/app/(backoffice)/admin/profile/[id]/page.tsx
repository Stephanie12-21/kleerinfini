"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const Profile = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { id } = useParams();
  const [admin, setAdmin] = useState<{
    name: string;
    email: string;
    profileImages?: { path: string }[];
  } | null>(null);
  const [profileImage, setProfileImage] = useState<string>("/pdp.png");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");
  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);

  const handleGoLogin = () => {
    router.push("/login");
  };

  const fetchAdminData = useCallback(async () => {
    try {
      const response = await fetch(`/api/profile/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch admin data");
      }
      const data = await response.json();
      console.log("Réponse de l'API complète:", data);

      if (data && data.admin) {
        setAdmin(data.admin);
        if (data.admin.profileImages && data.admin.profileImages.length > 0) {
          setProfileImage(data.admin.profileImages[0].path);
        } else {
          setProfileImage("/pdp.png"); // Image par défaut
        }
        setNewName(data.admin.name);
        setNewEmail(data.admin.email);
      } else {
        setError("Utilisateur non trouvé");
      }
      setLoading(false);
    } catch (error: unknown) {
      setError((error as Error).message);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchAdminData();
    }
  }, [id, fetchAdminData]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    if (!newName || !newEmail) {
      setError("Tous les champs doivent être remplis");
      return;
    }

    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    if (newProfileImage) {
      formData.append("profileImage", newProfileImage);
    }

    try {
      const response = await fetch(`/api/profile/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du profil");
      }

      fetchAdminData();
      setIsEditing(false);
    } catch (error: unknown) {
      setError((error as Error).message);
    }
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        <p>Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        <p className="text-red-500">Erreur: {error}</p>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        <p>Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
      <div className="flex flex-col items-center">
        <Image
          src={profileImage}
          alt="Profile Image"
          width={200}
          height={200}
          className="rounded-full"
        />

        {!isEditing ? (
          <>
            <span className="mt-2 text-lg">Nom: {admin.name}</span>
            <span className="mt-2 text-lg">Email: {admin.email}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 py-2 px-5 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Modifier les données
            </button>
          </>
        ) : (
          <div className="mt-4 w-full max-w-md">
            <input
              type="name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom"
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            />
            <button
              onClick={handleSaveChanges}
              className="py-2 px-5 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Enregistrer les modifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
