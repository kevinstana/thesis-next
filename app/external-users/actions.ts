"use server";

import { authFetch } from "@/lib/utils";
import { CreateExternalUser } from "@/types/app-types";
import { revalidateTag } from "next/cache";

export async function createExternalUser(user: CreateExternalUser | undefined) {

  const res = await authFetch("external-users", "POST", user);
  revalidateTag("external-users");

  return res;
}
