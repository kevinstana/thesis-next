import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        const user: User = await fetch("http://localhost:9090/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }).then((res) => res.json());

        if (!user.accessToken) {
          return null;
        }

        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    authorized: ({ auth, request }) => {
      //   if (request.method === "POST") {
      //     return true;
      //   }

      if (request.nextUrl.pathname === "/login" && Boolean(auth?.user)) {
        return NextResponse.redirect(new URL("/", request.url));
      }

      return Boolean(auth?.user);
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.username = user.username;
        token.email = String(user.email);
        token.name = String(user.name);
        token.title = user.title;

        return token;
      }

      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.username = token.username;
      session.email = token.email;
      session.name = token.name;
      session.title = token.title;

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
