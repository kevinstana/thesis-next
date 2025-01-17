"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export default function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="transition-colors disabled:pointer-events-none disabled:opacity-50"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : (
        "Sign Out"
      )}
    </Button>
  );
}
