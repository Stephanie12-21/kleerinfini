"use client";

import { Edit2Icon, PlusCircle, Trash2Icon } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return (
      <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
        <p>Connexion requise</p>
        <p className="text-center mb-6 text-gray-600">
          Veuillez vous connecter à votre compte pour continuer
        </p>
        <div className="flex justify-center">
          <button type="button" className="w-full">
            Se connecter
          </button>
        </div>
      </div>
    );
  }
  const handleAddBlog = () => {
    router.push("admin/blog/addblog/");
  };
  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center justify-center py-8">
      <Image
        src={session.user.image || "/pdp.png"}
        alt="User profile"
        width={80}
        height={80}
        className="w-[80px] h-[80px] rounded-full border-2 border-indigo-600 object-cover"
      />
      <div className="flex flex-col mt-4">
        <span className="font-bold text-lg space-x-4">
          Bienvenue <span className="text-orange-500">{session.user.name}</span>{" "}
        </span>
      </div>

      <div className="flex items-center justify-center flex-col mt-5 sm:flex-row gap-3 sm:gap-4 w-full max-w-md sm:max-w-lg md:max-w-xl mb-8">
        <button className=" p-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors  text-sm md:text-base">
          <Edit2Icon />
        </button>
        <button className=" p-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors  text-sm md:text-base">
          <Trash2Icon />
        </button>
        <button className=" p-3 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors  text-sm md:text-base">
          <PlusCircle onClick={handleAddBlog} />
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
