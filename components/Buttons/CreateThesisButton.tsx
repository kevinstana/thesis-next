"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function CreateThesisButton({
  modalRef,
}: Readonly<{
  modalRef: React.RefObject<{ openDialog: () => void }>;
}>) {
  return (
    <Button
      className="border rounded-lg max-w-fit pr-6 h-[2.625rem]"
      onClick={() => modalRef.current?.openDialog()}
    >
      <Plus />
      <span>Create</span>
    </Button>
  );
}
