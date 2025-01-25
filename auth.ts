import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { isAdminPath } from "./lib/paths";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      authorize: async (credentials) => {
        const url = `${process.env.API_URL}/${
          credentials.isExternal !== "null" ? "login-external" : "login"
        }`;

        const user: User = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }).then((res) => res.json());

        return user;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 3600 },
  callbacks: {
    signIn({ user }) {
      if (user.message) {
        console.log(user.message)
        switch (user.message) {
          case "Invalid credentials":
            return "/login?error=invalid_credentials";
          case "Access denied. Please contact your system administrator.":
            return "/login?error=access_denied";
          case "Account disabled. Please contact your system administrator.":
            return "/login?error=account_disabled";
        }

        return "/login?error=something_went_wrong";
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        const {
          accessToken,
          refreshToken,
          username,
          email,
          firstName,
          lastName,
          role,
          isExternal,
        } = user;

        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.accessExp = Number(jwtDecode(accessToken).exp);
        token.refreshExp = Number(jwtDecode(refreshToken).exp);

        token.username = username;
        token.email = String(email);
        token.firstName = firstName;
        token.lastName = lastName;
        token.role = role;
        token.isExternal = isExternal ?? false;
        token.failedRefresh = false;

        return token;
      } else if (token.accessExp * 1000 < Date.now()) {
        const res = await fetch(`${process.env.API_URL}/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.accessToken}`,
          },
          body: JSON.stringify(token.refreshToken),
        });

        if (!res.ok) {
          token.failedRefresh = true;

          return token;
        }

        const newTokens = await res.json();
        if (!token.accessToken) {
          token.failedRefresh = true;

          return token;
        }

        token.accessToken = newTokens.accessToken;
        token.refreshToken = newTokens.refreshToken;
        token.accessExp = Number(jwtDecode(newTokens.accessToken).exp);
        token.refreshExp = Number(jwtDecode(newTokens.refreshToken).exp);

        return token;
      }

      return token;
    },
    session({ session, token }) {
      const {
        accessToken,
        sub,
        username,
        firstName,
        lastName,
        role,
        isExternal,
        failedRefresh,
      } = token;

      session.accessToken = accessToken;
      session.user.id = String(sub);
      session.user.username = username;
      session.user.firstName = firstName;
      session.user.lastName = lastName;
      session.user.role = role;
      session.user.isExternal = isExternal;
      session.failedRefresh = failedRefresh;

      return session;
    },
    authorized: ({ auth, request }) => {
      if (auth?.failedRefresh) {
        return NextResponse.redirect(new URL("/logout", request.url));
      }

      if (Boolean(auth?.user)) {
        const role = auth?.user?.role;
        const url = request.nextUrl.pathname;

        if (role !== "ADMIN" && isAdminPath(url)) {
          return NextResponse.redirect(new URL("/", request.url));
        }

        if (url === "/login") {
          return NextResponse.redirect(new URL("/", request.url));
        }
      }

      return Boolean(auth?.user);
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
});
