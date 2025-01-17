// NextAuth type augmentation
declare module "next-auth" {
  interface User {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isExternal?: boolean;
    accessToken: string;
    refreshToken: string;
    message?: string;
  }

  interface Session {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isExternal?: boolean;
    accessToken: string;
    failedRefresh: boolean;
  }
}

import "next-auth/jwt";
import { Role } from "./app-types";

declare module "next-auth/jwt" {
  interface JWT {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    isExternal?: boolean;
    accessToken: string;
    refreshToken: string;
    accessExp: number;
    failedRefresh: boolean;
  }
}
