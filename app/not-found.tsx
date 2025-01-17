import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center mt-[300px]">
      <h1 className="text-2xl">Resource not found</h1>
      <Link href="/">
        <Button className="mt-2">Go to Home Page</Button>
      </Link>
    </div>
  );
}
