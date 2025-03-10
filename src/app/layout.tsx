// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Provider from "./context/Provider";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "Kleer Infini",
//   description:
//     "Votre partenaire pour les services de technologie et d'exportation",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="fr">
//       <Provider>
//         <body
//           className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//         >
//           {children}
//         </body>
//       </Provider>
//     </html>
//   );
// }
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import Provider from "./context/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="fr" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head />
      <body className="antialiased">
        <Provider session={session}>{children}</Provider>
      </body>
    </html>
  );
}
