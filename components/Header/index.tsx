"use client";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  console.log(pathname);
  if (pathname === "/settings") {
    return null;
  }

  return (
    <header className="fixed top-0 flex w-full h-[32px] items-center justify-center">
      Header
    </header>
  );
}
