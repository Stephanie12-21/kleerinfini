import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

interface VerifyPasswordRequest {
  userId: string;
  currentPassword: string;
}

// Fonction pour vérifier le mot de passe actuel
export async function verifyCurrentPassword(
  userId: string,
  currentPassword: string
) {
  if (!userId) {
    return NextResponse.json(
      { error: "L'ID utilisateur est requis" },
      { status: 400 }
    );
  }

  try {
    // Vérifier si userId est un entier valide
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return NextResponse.json(
        { error: "ID utilisateur invalide" },
        { status: 400 }
      );
    }

    // Rechercher l'utilisateur dans la base de données
    const user = await db.admin.findUnique({
      where: { id: userIdInt },
      select: { password: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Vérifier si le mot de passe actuel correspond
    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Le mot de passe actuel est incorrect" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la vérification du mot de passe :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// API pour vérifier le mot de passe actuel
export async function POST(req: Request) {
  try {
    const { userId, currentPassword }: VerifyPasswordRequest = await req.json();
    console.log("Données reçues :", userId, "et", currentPassword);

    if (!userId || !currentPassword) {
      return NextResponse.json(
        { error: "L'ID utilisateur et le mot de passe sont requis" },
        { status: 400 }
      );
    }

    return await verifyCurrentPassword(userId, currentPassword);
  } catch (error) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json(
      { error: "Données invalides ou requête mal formée" },
      { status: 400 }
    );
  }
}
