import type { Metadata } from "next";
import "./globals.css";
import { getServerSession } from "next-auth";
import Provider from "./context/Provider";

export const metadata: Metadata = {
  title: "Kleer Infini",
  description:
    "Votre partenaire pour les services de technologie et d'exportation",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getServerSession(); // Récupération de la session

  return (
    <html lang="fr">
      <head />
      <body className="antialiased">
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
