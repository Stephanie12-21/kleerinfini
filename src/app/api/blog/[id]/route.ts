// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";

// interface Params {
//   id: string;
// }

// export async function GET(request: Request, { params }: { params: Params }) {
//   const { id } = await params;

//   try {
//     const article = await db.article.findUnique({
//       where: { id: parseInt(id, 10) },
//       include: { images: true },
//     });

//     if (!article) {
//       return NextResponse.json(
//         { message: "Article non trouvé" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(article, { status: 200 });
//   } catch (error) {
//     console.error("Erreur lors de la récupération de l'article :", error);
//     return NextResponse.json(
//       { message: "Erreur interne du serveur" },
//       { status: 500 }
//     );
//   }
// }

// interface Params {
//   id: string;
// }

// export async function DELETE(request: Request, { params }: { params: Params }) {
//   const { id } = await params;
//   const articleId = parseInt(id, 10);

//   try {
//     if (!articleId) {
//       return NextResponse.json({ message: "ID manquant" }, { status: 400 });
//     }

//     await db.image.deleteMany({ where: { articleId } });
//     const deletedArticle = await db.article.delete({
//       where: { id: articleId },
//     });

//     return NextResponse.json({
//       message: "Article et images supprimés avec succès",
//       article: deletedArticle,
//     });
//   } catch (error) {
//     console.error("Erreur lors de la suppression de l'article :", error);
//     return NextResponse.json(
//       { message: "Erreur interne du serveur" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: Request, { params }: { params: Params }) {
//   const { id } = await params;
//   const articleId = parseInt(id, 10);
//   const body = await request.formData();

//   try {
//     if (!articleId) {
//       return NextResponse.json({ message: "ID manquant" }, { status: 400 });
//     }

//     const titre = body.get("titre") as string;
//     const contenu = body.get("contenu") as string;
//     const categorieArticle = body.get("categorieArticle") as string;
//     const files = body.getAll("files") as File[];

//     if (!titre || !contenu || !categorieArticle) {
//       return NextResponse.json(
//         { message: "Tous les champs doivent être renseignés." },
//         { status: 400 }
//       );
//     }

//     await db.article.update({
//       where: { id: articleId },
//       data: { titre, contenu, categorieArticle },
//     });

//     if (files.length > 0) {
//       await db.image.deleteMany({ where: { articleId } });

//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append("upload_preset", "ko4bjtic");

//         const uploadResponse = await fetch(
//           "https://api.cloudinary.com/v1_1/dtryutlkz/image/upload",
//           {
//             method: "POST",
//             body: formData,
//           }
//         );

//         const uploadResult = await uploadResponse.json();

//         if (!uploadResponse.ok || !uploadResult.secure_url) {
//           throw new Error("Échec du téléchargement de l'image");
//         }

//         await db.image.create({
//           data: { path: uploadResult.secure_url, articleId },
//         });
//       }
//     }

//     return NextResponse.json(
//       { message: "Article mis à jour avec succès!" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Erreur lors de la mise à jour de l'article :", error);
//     return NextResponse.json(
//       { message: "Erreur interne du serveur" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface Params {
  id: string;
}

// ✅ Récupérer un article par ID
export async function GET(request: Request, { params }: { params: Params }) {
  const articleId = Number(params.id);
  if (isNaN(articleId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  try {
    const article = await db.article.findUnique({
      where: { id: articleId },
      include: { images: true },
    });

    if (!article) {
      return NextResponse.json(
        { message: "Article non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(article, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'article :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// ✅ Supprimer un article par ID
export async function DELETE(request: Request, { params }: { params: Params }) {
  const articleId = Number(params.id);
  if (isNaN(articleId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  try {
    await db.image.deleteMany({ where: { articleId } });
    const deletedArticle = await db.article.delete({
      where: { id: articleId },
    });

    return NextResponse.json({
      message: "Article et images supprimés avec succès",
      article: deletedArticle,
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'article :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// ✅ Mettre à jour un article
export async function PUT(request: Request, { params }: { params: Params }) {
  const articleId = Number(params.id);
  if (isNaN(articleId)) {
    return NextResponse.json({ message: "ID invalide" }, { status: 400 });
  }

  try {
    const body = await request.formData();
    const titre = body.get("titre") as string;
    const contenu = body.get("contenu") as string;
    const categorieArticle = body.get("categorieArticle") as string;
    const files = body.getAll("files") as File[];

    if (!titre || !contenu || !categorieArticle) {
      return NextResponse.json(
        { message: "Tous les champs doivent être renseignés." },
        { status: 400 }
      );
    }

    await db.article.update({
      where: { id: articleId },
      data: { titre, contenu, categorieArticle },
    });

    if (files.length > 0) {
      await db.image.deleteMany({ where: { articleId } });

      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
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

        await db.image.create({
          data: { path: uploadResult.secure_url, articleId },
        });
      }
    }

    return NextResponse.json(
      { message: "Article mis à jour avec succès!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'article :", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
