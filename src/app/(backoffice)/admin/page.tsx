"use client";

import {
  Edit2Icon,
  PlusCircle,
  Trash2Icon,
  SaveIcon,
  XIcon,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [image, setImage] = useState(session?.user?.image || "/pdp.png");

  const handleGoLogin = () => {
    router.push("/login");
  };

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 min-h-screen space-y-5 flex flex-col items-center justify-center py-8">
        <p>Connexion requise</p>
        <p className="text-center  text-gray-600">
          Veuillez vous connecter à votre compte pour continuer
        </p>
        <button
          onClick={handleGoLogin}
          className="py-2 px-5 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors w-fit text-sm md:text-base"
        >
          Se connecter
        </button>
      </div>
    );
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    console.log("Nouveau nom:", name);
    console.log("Nouvel email:", email);
    console.log("Nouvelle image:", image);

    setIsEditing(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
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

      <div className="flex items-center justify-center flex-col mt-5 sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl mb-8">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-3 bg-green-500 text-white rounded-md cursor-pointer hover:bg-green-600 transition-colors text-sm md:text-base"
            >
              <SaveIcon />
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="p-3 bg-gray-500 text-white rounded-md cursor-pointer hover:bg-gray-600 transition-colors text-sm md:text-base"
            >
              <XIcon />
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="p-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors text-sm md:text-base"
          >
            <Edit2Icon />
          </button>
        )}
        <button className="p-3 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-600 transition-colors text-sm md:text-base">
          <Trash2Icon />
        </button>
        <button
          onClick={() => router.push("admin/blog/addblog/")}
          className="p-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors text-sm md:text-base"
        >
          <PlusCircle />
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
