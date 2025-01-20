"use client"

import { ReactNode } from "react";
import { Toaster } from "../ui/toaster";
import { NotificationProvider } from "@/providers/NotificationProvider";

export default function NotificationProviderWrapper({children}: Readonly<{children: ReactNode}>) {
    return (
        <NotificationProvider>
            {children}
            <Toaster />
        </NotificationProvider>
    )
}