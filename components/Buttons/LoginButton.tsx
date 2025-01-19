"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="mt-2 w-full bg-gray-900 text-white rounded-xl px-4 py-3 text-[17px] font-medium hover:bg-gray-800 transition-colors disabled:pointer-events-none disabled:opacity-50"
      disabled={pending}
    >
      {pending ? (
        <div className="flex items-center justify-center">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </div>
      ) : (
        "Continue"
      )}
    </button>
  );
}
