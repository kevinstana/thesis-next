import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import getSession from "./getSession";
import { availableRoles, Role } from "@/types/app-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    next: { tags: [tag ?? ""]}
  });

  return await res.json();
}

export function formatFromCamelCase(header: string): string {
  const words = header.split(/(?=[A-Z])/);
  const formattedHeader = words.join(" ");

  return formattedHeader;
}

export function getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function isValidRole(role: string): role is Role {
  return availableRoles.includes(role as Role);
}