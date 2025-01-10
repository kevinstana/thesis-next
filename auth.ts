import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {

        
        const url = `${process.env.API_URL}/${
          credentials.isExternal !== 'null' ? "login-external" : "login"
        }`;
        
        console.log(credentials, url)
        const user: User = await fetch(url, {
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
      if (
        (request.nextUrl.pathname === "/login" ||
          request.nextUrl.pathname === "/") &&
        Boolean(auth?.user)
      ) {
        return NextResponse.redirect(new URL("/thesis", request.url));
      }

      return Boolean(auth?.user);
    },
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        // token.username = user.username;
        // token.email = String(user.email);
        // token.name = String(user.name);
        // token.title = user.title;

        return token;
      } else if (
        jwtDecode(token.accessToken).exp &&
        Number(jwtDecode(token.accessToken).exp) * 1000 < Date.now()
      ) {
        return token;
      }

      return token;
    },
    session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      // session.username = token.username;
      // session.email = token.email;
      // session.name = token.name;
      // session.title = token.title;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
});
