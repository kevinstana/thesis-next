"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

export async function authenticate(formData: FormData) {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      isExternal: formData.get("isExternal"),
      redirectTo: "/thesis",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          redirect("/login?error=Invalid_credentials");
        default:
          redirect("/login?error=something_went_wrong");
      }
    }
    throw error;
  }
}
