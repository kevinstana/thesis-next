"use client";

import { AddExternalUserModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import AddExternalUserButton from "../Buttons/AddExternalUserButton";
import AddExternalUserForm from "../Forms/AddExternalUserForm";
import { X } from 'lucide-react';

const AddExternalUserModal = forwardRef<AddExternalUserModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    openDialog: () => {
      setOpen(true);
    },
  }));

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100] ${
        open ? "block" : "hidden"
      }`}
    >
      <div className="bg-white w-full max-w-[60%] h-[90%] rounded-lg p-6 flex flex-col relative">
        {/* Close Button (X icon) */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setOpen(false)}
        >
          <X size={18} />
        </button>

        {/* Dialog Header */}
        <div className="mb-4">
          <h2 className="text-primary-700 text-base">Add an External User</h2>
        </div>

        {/* Dialog Body */}
        <div className="flex flex-col flex-grow justify-between p-4 overflow-auto" tabIndex={-1}>
          {/* Form Component */}
          <AddExternalUserForm />

          {/* Dialog Footer */}
          <div className="flex justify-end mt-4">
            <button
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

AddExternalUserModal.displayName = "AddExternalUserModal";

export default function AddExternalUserModalWrapper() {
  const addExternalUserModalRef = useRef<AddExternalUserModalRef>(null);

  return (
    <>
      <AddExternalUserButton modalRef={addExternalUserModalRef} />
      <AddExternalUserModal ref={addExternalUserModalRef} />
    </>
  );
}
