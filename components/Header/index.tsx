"use client";

import { usePathname } from "next/navigation";
import LogoutButton from "../LogoutButton";
import { customLogout } from "@/app/logout/actions";

export default function Header() {
  const pathname = usePathname();

  if (pathname === "/settings") {
    return null;
  }

  return (
    <header className="h-16 border-b flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          {/* <input
            type="text"
            placeholder="Search..."
            className="border rounded-lg pl-10 pr-4 py-2 focus:outline-none"
          /> */}
          <h1 className="pl-10 pr-4 py-2 text-2xl font-medium">Dashboard</h1>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        <form action={customLogout}>
          <LogoutButton />
        </form>
        <div className="w-8 h-8 rounded-full"></div>
      </div>
    </header>
  );
}
