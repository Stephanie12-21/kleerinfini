import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

interface EmailRequestBody {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

async function sendMessageContact({
  name,
  email,
  phone,
  subject,
  message,
}: EmailRequestBody): Promise<void> {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS
  ) {
    throw new Error(
      "Les variables d'environnement SMTP ne sont pas correctement définies."
    );
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.SMTP_USER,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <div style="background-color:  #2b7fff; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Un nouveau message depuis votre site Lilee.</h1>
        </div>
        <div style="padding: 20px; line-height: 1.5; color: #333333;">
          <p style="font-size: 16px; margin-bottom: 15px;">Bonjour,</p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            Vous avez reçu un nouveau message de la part de ${name}.
          </p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            <strong>Voici le message envoyé :</strong><br>
            ${message}
          </p>
          <hr style="border: 1px solid  #2b7fff; margin: 30px 0;">
          <h2 style="font-size: 18px; font-weight: bold; color: #333333;">Informations de l'envoyeur :</h2>
          <p style="font-size: 16px; margin-bottom: 15px;">
            <strong>Nom :</strong> ${name}<br>
            <strong>Email :</strong> ${email}<br>
            <strong>Téléphone :</strong> ${phone}
          </p>
          <p style="font-size: 16px; margin-bottom: 15px;">
            Merci,<br>
            L'équipe de Kleer Infini.
          </p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; color: #2b7fff; font-size: 12px;">
          <p>© 2025 Kleer Infini. Tous droits réservés.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Message envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi du message :", error);
    throw new Error("Erreur lors de l'envoi de l'e-mail");
  }
}

// Handler POST avec typage TypeScript
export async function POST(req: Request): Promise<Response> {
  try {
    const body: EmailRequestBody = await req.json();

    // Vérification des champs obligatoires
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !phone || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    await sendMessageContact(body);

    return NextResponse.json(
      { message: "Message envoyé à l'administrateur avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la requête :", error);
    return NextResponse.json(
      { error: (error as Error).message || "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
