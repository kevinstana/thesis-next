"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function customLogout() {
  await signOut({ redirect: false });
  redirect("/login");
}
