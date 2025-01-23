"use client";

import { ViewExternalUserModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import { getExternalUserProfile } from "@/app/external-users/actions";
import useSWR from "swr";
import RecordNavigation from "../RecordNavigation";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";

const ViewExternalUserModal = forwardRef<ViewExternalUserModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const [list, setList] = useState<string[]>([]);

  const { data } = useSWR(
    () => value,
    () => getExternalUserProfile(value),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: () => console.log("hello"),
      onError: () => console.log("error"),
    }
  );

  console.log(data)

  useImperativeHandle(ref, () => ({
    openDialog: (username) => {
      setOpen(true);
      setValue(username);
      setList(JSON.parse(localStorage.getItem("external-usernames") ?? ""));
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-full max-w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`External Users / ${value}`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between p-4 overflow-auto"
          tabIndex={-1}
        >
          {/* Viewing Profile and navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              <h3 className="font-medium text-sm/[1.5rem]">Viewing Profile</h3>
              <RecordNavigation list={list} value={value} setValue={setValue} />
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ViewExternalUserModal.displayName = "ViewExternalUserModal";

export { ViewExternalUserModal };
