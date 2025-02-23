"use server";

import { CreateThesisBody } from "@/components/Forms/CreateThesisForm";
import { authFetch } from "@/lib/server-actions";
import { revalidateTag } from "next/cache";

export async function createThesis(thesis: CreateThesisBody, tag: string) {
  const res = await authFetch("theses", "POST", thesis);

  if (res.status === 200) {
    revalidateTag(tag);
  }

  return res;
}

export async function getTheses(urlSearchParams: string) {
  const res = await authFetch(
    `theses?${urlSearchParams}`,
    "GET",
    null,
    "theses"
  );

  return res;
}
