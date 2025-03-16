// import NextAuth, { NextAuthOptions, User } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { db } from "@/lib/db";
// import { compare } from "bcrypt";

// type ExtendedUser = User & {
//   id: string;
// };

// declare module "next-auth" {
//   interface User {
//     id: string;
//   }
//   interface Session {
//     user: ExtendedUser;
//   }
// }

// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(db),
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: { signIn: "/signup" },
//   session: { strategy: "jwt" },
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "email",
//           placeholder: "email@gmail.com",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials): Promise<ExtendedUser | null> {
//         if (!credentials?.email || !credentials.password) return null;

//         const user = await db.admin.findUnique({
//           where: { email: credentials.email },
//           include: { profileImages: true },
//         });

//         if (!user || !(await compare(credentials.password, user.password))) {
//           return null;
//         }

//         return {
//           id: user.id.toString(),
//           name: user.name ?? null,
//           email: user.email,
//           image: user.profileImages?.[0]?.path ?? null,
//         } as ExtendedUser;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.email = user.email ?? "";
//         token.picture = user.image ?? null;
//         token.name = user.name ?? null;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id as string,
//         name: token.name ?? null,
//         email: token.email ?? "",
//         image: token.picture ?? null,
//       };
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
