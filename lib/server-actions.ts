"use server";

import { revalidateTag } from "next/cache";
import getSession from "./getSession";
import { TransformedUser } from "@/types/app-types";
import { dateFormatter } from "./utils";

export async function authFetch(
  url: string,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  requestBody?: unknown,
  formData?: FormData | null,
  tag?: string
) {
  const session = await getSession();
  const accessToken = session?.accessToken ?? "";

  let body = null;
  if (method !== "GET") {
    body = formData ? formData : JSON.stringify(requestBody);
  }

  const res = await fetch(`${process.env.API_URL}/${url}`, {
    method,
    headers: {
      ...(formData ? {} : { "Content-Type": "application/json" }),
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

export async function customRevalidateTag(tag: string) {
  revalidateTag(tag)
}

export async function authFetchPdf(url: string) {
  const session = await getSession();
  const accessToken = session?.accessToken ?? "";

  const response = await fetch(`${process.env.API_URL}/${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/pdf",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const blob = await response.blob();
  const ab = await blob.arrayBuffer();

  return Array.from(new Uint8Array(ab));
}

export async function getToken() {
  const session = await getSession();
  const accessToken = session?.accessToken ?? "";

  return accessToken;
}

export async function getUserProfile(username: string, path: string) {
  const res = await authFetch(
    `${path === "external-users" ? path : "users"}/${username}`,
    "GET"
  );

  const transformedUser: TransformedUser = {
    ...res.data,
    createdAt: dateFormatter(String(res.data.createdAt)),
    lastModified: dateFormatter(String(res.data.lastModified)),
  };

  return { status: res.status, data: transformedUser, error: res.error };
}

export async function updateUser(id: number, isEnabled: string, tag: string) {
  const { data, status, error } = await authFetch(
    `users/${id}`,
    "PUT",
    isEnabled
  );

  if (status === 200) {
    revalidateTag(tag);
  }

  return { data, status, error };
}

export async function getOneThesis(id: string) {
  const res = await authFetch(`theses/${id}`, "GET");

  return { status: res.status, data: res.data, error: res.error };
}

export async function getThesisCourses(thesisId: string) {
  const res = await authFetch(`courses/${thesisId}`, "GET");

  return { status: res.status, data: res.data, error: res.error };
}
