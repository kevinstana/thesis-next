"use client";

import { useUserDetails } from "@/providers/UserDetailsProvier";
import CreateThesisModalModalWrapper from "../Modals/CreateThesisModal";
import Filters from "./Filters";

export default function ThesesTableOptions({path}: {path: string}) {
  const { role } = useUserDetails();

  return (
    <div className="flex items-center gap-1">
      {role === "PROFESSOR" ? <CreateThesisModalModalWrapper /> : null}
      <Filters path={path} />
    </div>
  );
}
