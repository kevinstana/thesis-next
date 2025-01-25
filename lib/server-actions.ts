"use server";

import { revalidateTag } from "next/cache";
import getSession from "./getSession";

export async function authFetch(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  requestBody?: unknown,
  tag?: string
) {
  const session = await getSession();
  const accessToken = session?.accessToken ?? "";

  const body = requestBody ? JSON.stringify(requestBody) : null;
  const res = await fetch(`${process.env.API_URL}/${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body,
    next: { tags: [tag ?? ""] },
  });

  const status = res.status;
  const data = await res.json();
  const error = status !== (200 | 201 | 204) && String(data.message);

  return { status, data, error };
}

export async function getUserProfile(username: string, path: string) {
  const res = await authFetch(`${path}/${username}`, "GET");

  return res;
}

export async function updateUser(id: number, isEnabled: string, tag: string) {
  const {data, status, error} = await authFetch(`users/${id}`, "PUT", isEnabled)

  if (status === 200) {
    revalidateTag(tag)
  }

  return {data, status, error}
}