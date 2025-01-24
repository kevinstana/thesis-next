"use client";

import { customLogout } from "@/app/logout/actions";
import LogoutButton from "../Buttons/LogoutButton";
import Title from "../Title";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const path = pathname.split("/")[1];

  if (path === "login" || path === "logout") {
    return null;
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      <div className="flex items-center space-x-4 pt-2">
        <Title />
      </div>

      <div className="flex items-center space-x-4">
        <form action={customLogout}>
          <LogoutButton />
        </form>
        <div className="w-8 h-8 rounded-full"></div>
      </div>
    </header>
  );
}
