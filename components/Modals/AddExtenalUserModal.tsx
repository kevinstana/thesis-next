"use client";

import { AddExternalUserModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import AddExternalUserButton from "../Buttons/AddExternalUserButton";
import AddExternalUserForm from "../Forms/AddExternalUserForm";
import NotificationProviderWrapper from "../ClientWrappers/NotificationProviderWrapper";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";

const AddExternalUserModal = forwardRef<AddExternalUserModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => {
      setOpen(true);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-full max-w-[60%] h-[90%] rounded-lg flex flex-col relative">
        <BaseModalHeader title="Add an External User" setOpen={setOpen} />
        <AddExternalUserForm setOpen={setOpen} />
      </BaseModalContent>
    </BaseModal>
  );
});

AddExternalUserModal.displayName = "AddExternalUserModal";

export default function AddExternalUserModalWrapper() {
  const addExternalUserModalRef = useRef<AddExternalUserModalRef>(null);

  return (
    <NotificationProviderWrapper>
      <AddExternalUserButton modalRef={addExternalUserModalRef} />
      <AddExternalUserModal ref={addExternalUserModalRef} />
    </NotificationProviderWrapper>
  );
}
