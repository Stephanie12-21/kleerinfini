import NextAuth, { NextAuthOptions, User } from "next-auth";
import { compare } from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

type ExtendedUser = User & {
  id: string;
  email: string;
  image?: string | null;
  name?: string | null;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
  interface User {
    id: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signup",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials.password) {
          console.error("Identifiants manquants");
          return null;
        }

        const existingComptePerso = await db.admin.findUnique({
          where: { email: credentials.email },
          include: { profileImages: true },
        });

        if (!existingComptePerso) {
          console.error("Utilisateur non trouvé");
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingComptePerso.password
        );

        if (!passwordMatch) {
          console.error("Mot de passe incorrect");
          return null;
        }

        console.log(
          "Authentification réussie pour :",
          existingComptePerso.email
        );

        const imageUrl = existingComptePerso.profileImages?.[0]?.path ?? null;

        return {
          id: existingComptePerso.id.toString(),
          name: existingComptePerso.name ?? null,
          email: existingComptePerso.email,
          image: imageUrl,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
        token.picture = user.image ?? null;
        token.name = user.name ?? null;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name ?? null,
        email: token.email ?? "",
        image: token.picture ?? null,
      };

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
