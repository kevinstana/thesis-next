declare module "next-auth" {
  interface User {
    accessToken: string
    refreshToken: string
    username: string
    email: string
    name: string
    title: string
  }

  interface Session {
    accessToken: string
    refreshToken: string
    username: string
    email: string
    name: string
    title: string
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string
    refreshToken: string
    username: string
    email: string
    name: string
    title: string
  }
}
