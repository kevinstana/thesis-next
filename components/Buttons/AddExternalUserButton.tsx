"use client";

import { Button } from "../ui/button";
import { Plus } from "lucide-react";

export default function AddExternalUserButton({
  modalRef,
}: {
  modalRef: React.RefObject<{ openDialog: (text: string) => void }>;
}) {
  return (
    <>
      <Button
        className="border rounded-lg max-w-fit h-[2.625rem]"
        onClick={() => {
          modalRef.current?.openDialog("hello from button")
        }}
      >
        <Plus />
        <span>Add External User</span>
      </Button>
    </>
  );
}
