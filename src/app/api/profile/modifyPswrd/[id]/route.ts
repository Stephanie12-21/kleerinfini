import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";

interface Params {
  params: {
    id: string;
  };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = params;
    const { newPassword }: { newPassword: string } = await request.json();
    console.log("ID utilisateur :", id);

    if (!id) {
      console.log("Erreur : ID utilisateur manquant.");
      return NextResponse.json({ message: "ID manquant" }, { status: 400 });
    }

    if (!newPassword) {
      console.log("Erreur : Nouveau mot de passe non fourni.");
      return NextResponse.json(
        { message: "Le nouveau mot de passe est requis." },
        { status: 400 }
      );
    }

    const idInt = parseInt(id, 10);
    if (isNaN(idInt)) {
      console.log("Erreur : ID utilisateur invalide.");
      return NextResponse.json(
        { message: "ID utilisateur invalide." },
        { status: 400 }
      );
    }

    const user = await db.admin.findUnique({
      where: { id: idInt },
      select: { password: true },
    });

    if (!user) {
      console.log("Erreur : Utilisateur non trouvé.");
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      console.log("Erreur : Le nouveau mot de passe est identique à l'ancien.");
      return NextResponse.json(
        {
          message:
            "Le nouveau mot de passe ne peut pas être identique à l'ancien.",
        },
        { status: 400 }
      );
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.admin.update({
      where: { id: idInt },
      data: { password: hashedNewPassword },
    });

    console.log("Mot de passe mis à jour avec succès pour l'utilisateur :", id);
    return NextResponse.json(
      { message: "Mot de passe mis à jour avec succès!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du mot de passe :", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du mot de passe." },
      { status: 500 }
    );
  }
}
