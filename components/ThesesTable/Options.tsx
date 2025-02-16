"use client";

import { useUserDetails } from "@/providers/UserDetailsProvier";
import CreateThesisModalModalWrapper from "../Modals/CreateThesisModal";

export default function ThesesTableOptions() {
  const { role } = useUserDetails();

  return (
    <div className="flex items-center gap-1">
      {role === "PROFESSOR" ? <CreateThesisModalModalWrapper /> : null}
    </div>
  );
}
