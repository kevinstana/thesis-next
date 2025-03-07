"use client";

import CreateThesisModalModalWrapper from "../Modals/CreateThesisModal";
import Filters from "./Filters";
import { Role } from "@/types/app-types";

export default function ThesesTableOptions({path, role}: {path: string, role: Role}) {

  return (
    <div className="flex items-center gap-1">
      {role === "PROFESSOR" && path === "my-theses" ? <CreateThesisModalModalWrapper /> : null}
      <Filters path={path} />
    </div>
  );
}
