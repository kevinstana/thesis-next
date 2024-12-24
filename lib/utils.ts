import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function authFetch(
  url: string,
  method: "GET" | "POST" | "PATCH" | "DELETE",
  request_body?: unknown
) {
  try {
    const session = await auth();
    const body = request_body ? JSON.stringify(request_body) : null;
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body,
    });

    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error) {
      switch (error.message) {
        case "Unauthorized":
          redirect("/login");
      }
    }

    return { error: { message: "Something went wrong" } };
  }
}
