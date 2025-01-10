"use client";

import { useRouter } from "next/navigation";

export default function Balls() {
  const router = useRouter();

  return (
    <button type="button" onClick={() => router.push("/logout")}>
      lol
    </button>
  );
}
