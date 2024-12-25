"use client";

// import Link from "next/link";
// import { Button } from "../ui/button";
// import { ScrollArea } from "../ui/scroll-area";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === "/settings") {
    return null;
  }

  return (
    <aside className="left-0 h-[calc(100vh-32px)] w-[256px] bg-neutral-600 overflow-auto">
      sidebar
      <nav>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
        <div>hello 1</div>
        <div>hello 2</div>
        <div>hello 3</div>
        <div>hello 4</div>
        <div>hello 5</div>
      </nav>
    </aside>
  );
}
