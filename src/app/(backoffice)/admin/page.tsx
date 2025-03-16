"use client";

import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleGoBlog = () => router.push("/admin/blog");

  function handleGoResetPswrd() {
    if (session?.user?.id) {
      console.log("id", session.user.id);
      router.push(`/admin/security/${session.user.id}`);
    }
  }

  function handleGoProfilePage() {
    if (session?.user?.id) {
      console.log("id", session.user.id);
      router.push(`/admin/profile/${session.user.id}`);
    }
  }

  function handleGoLogin() {
    return router.push("/login");
  }

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

  return (
    <div className="container mx-auto px-4 min-h-screen flex flex-col items-center gap-4 justify-center py-8">
      <div className="flex flex-col items-center">
        <Image
          src={session.user.image || "/pdp.png"}
          alt="User profile"
          width={80}
          height={80}
          className="w-[80px] h-[80px] rounded-full border-2 border-indigo-600 object-cover"
        />

        <div className="flex flex-col mt-4 text-center">
          <span className="font-bold text-lg">
            Bienvenue{" "}
            <span className="text-orange-500">{session.user.name}</span>
          </span>
          <span className="text-gray-600 text-sm">{session.user.email}</span>
        </div>

        <div className="flex items-center mt-5 gap-4">
          <button
            onClick={handleSignOut}
            className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            <LogOutIcon />
          </button>
        </div>
      </div>

      <div className=" mx-auto px-4  flex flex-col items-center gap-4 justify-center py-8">
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition hover:bg-indigo-700"
          onClick={handleGoBlog}
        >
          Voir les articles
        </button>
        <button
          onClick={handleGoProfilePage}
          className="bg-indigo-600 text-white px-6 py-3 cursor-pointer rounded-lg shadow-md transition hover:bg-indigo-700"
        >
          Modifier le profil
        </button>
        <button
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md transition hover:bg-indigo-700"
          onClick={handleGoResetPswrd}
        >
          Modifier le mot de passe
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
