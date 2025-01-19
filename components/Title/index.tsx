"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { appPaths, appPathsMap } from "@/lib/paths";

const titleStyle = "pl-10 pr-4 py-2 text-xl md:text-2xl font-medium";

export default function Title() {
  const pathname = usePathname();

  if (!appPaths.includes(pathname)) {
    return <h1 className={titleStyle}>Not Found</h1>;
  }

  if (pathname === "/") {
    return <h1 className={titleStyle}>Home</h1>;
  }

  const path = pathname.split("/")[1];

  return <h1 className={titleStyle}>{appPathsMap[path]}</h1>;
}
