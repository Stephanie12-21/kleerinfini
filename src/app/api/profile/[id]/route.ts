import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  id: string;
}

export async function GET(req: Request, { params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID de l'utilisateur manquant." },
      { status: 400 }
    );
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        profileImages: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    const { password, ...adminData } = admin;
    console.log(password);

    return NextResponse.json(
      {
        admin: adminData,
        message: "Informations de l'utilisateur récupérées avec succès.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.formData();

    if (!id) {
      return new NextResponse(JSON.stringify({ message: "ID manquant" }), {
        status: 400,
      });
    }

    const name = body.get("name");
    const email = body.get("email");
    const images = body.getAll("profileImage");

    if (!name || !email) {
      return new NextResponse(
        JSON.stringify({ message: "Tous les champs doivent être renseignés." }),
        { status: 400 }
      );
    }

    const updatedAdmin = await db.admin.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: name as string,
        email: email as string,
      },
    });

    if (images.length > 0) {
      await db.profileImage.deleteMany({
        where: { id: updatedAdmin.id },
      });

      for (const file of images) {
        const formData = new FormData();
        formData.append("file", file as Blob);
        formData.append("upload_preset", "ko4bjtic");

        const uploadResponse = await fetch(
          "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.secure_url) {
          throw new Error("Échec du téléchargement de l'image");
        }

        const imageUrl = uploadResult.secure_url;

        await db.profileImage.create({
          data: {
            path: imageUrl,
            id: updatedAdmin.id,
            adminId: updatedAdmin.id,
          },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({ message: "Utilisateur mis à jour avec succès!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: "Erreur lors de la mise à jour de l'utilisateur",
      }),
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, { params }: { params: Params }) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { message: "ID de l'utilisateur manquant." },
      { status: 400 }
    );
  }

  try {
    const admin = await db.admin.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        profileImages: true,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé." },
        { status: 404 }
      );
    }

    await db.profileImage.deleteMany({
      where: { id: admin.id },
    });

    await db.admin.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json(
      { message: "Utilisateur et images supprimés avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
