"use client";

import { CreateThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import CreateThesisButton from "../Buttons/CreateThesisButton";
import CreateThesisForm from "../Forms/CreateThesisForm";

const CreateThesisModal = forwardRef<CreateThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => {
      setOpen(true);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-full max-w-[60%] h-[90%] rounded-lg flex flex-col relative">
        <BaseModalHeader title="Create Thesis" setOpen={setOpen} />
        <CreateThesisForm setOpen={setOpen} />
      </BaseModalContent>
    </BaseModal>
  );
});

CreateThesisModal.displayName = "CreateThesisModal";

export default function CreateThesisModalModalWrapper() {
  const createThesisModalRef = useRef<CreateThesisModalRef>(null);

  return (
    <>
      <CreateThesisButton modalRef={createThesisModalRef} />
      <CreateThesisModal ref={createThesisModalRef} />
    </>
  );
}
