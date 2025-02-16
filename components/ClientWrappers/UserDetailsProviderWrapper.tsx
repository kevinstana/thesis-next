"use client"

import { UserDetailsProvider } from "@/providers/UserDetailsProvier";
import { Role } from "@/types/app-types";
import { ReactNode } from "react";

export default function UserDetailsProviderWrapper({children, userId, role}: Readonly<{children: ReactNode, userId?: string; role?: Role}>) {
    return (
        <UserDetailsProvider userId={userId} role={role}>
            {children}
        </UserDetailsProvider>
    )
}