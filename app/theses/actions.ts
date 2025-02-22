"use server";

import { CreateThesisBody } from "@/components/Forms/CreateThesisForm";
import { authFetch } from "@/lib/server-actions";

export async function createThesis(thesis: CreateThesisBody) {
  const res = await authFetch("theses", "POST", thesis);

  return res;
}
