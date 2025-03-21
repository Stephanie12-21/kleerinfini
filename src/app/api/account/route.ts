import { db } from "@/lib/db";
import { hash } from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request): Promise<Response> {
  try {
    console.log("Début du traitement des données du formulaire");
    const body = await req.json();
    const { name, email, password, profileImages } = body;

    console.log("Données reçues :", { name, email, profileImages });

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Tous les champs requis doivent être remplis." },
        { status: 400 }
      );
    }

    const existingAdminByEmail = await db.admin.findUnique({
      where: { email },
    });
    if (existingAdminByEmail) {
      console.log("Email déjà utilisé");
      return NextResponse.json(
        { message: "Un utilisateur avec cet email existe déjà." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(password, 10);

    let imageUrl: string | null = null;

    if (profileImages) {
      console.log("Début de l'upload de l'image");
      const formData = new FormData();
      formData.append("file", profileImages);
      formData.append("upload_preset", "ko4bjtic");

      const uploadResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();
      console.log("Résultat de l'upload :", uploadResult);

      if (uploadResponse.ok && uploadResult.secure_url) {
        imageUrl = uploadResult.secure_url;
        console.log("Image uploadée avec succès, URL :", imageUrl);
      } else {
        console.error("Erreur lors de l'upload de l'image :", uploadResult);
        throw new Error("Échec de l'upload de l'image");
      }
    } else {
      console.log("Aucune image fournie pour l'upload.");
    }

    console.log("Création de l'utilisateur");
    const newcompteAdmin = await db.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (imageUrl) {
      console.log("Association de l'image avec l'utilisateur");
      await db.profileImage.create({
        data: {
          path: imageUrl,
          adminId: newcompteAdmin.id,
        },
      });
    }

    console.log("Compte créé avec succès");

    return NextResponse.json(
      {
        comptePerso: newcompteAdmin,
        message:
          "Compte créé avec succès. Les données ont été envoyées avec succès à la base de données et l'image a été bien enregistrée.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de la création du compte :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
