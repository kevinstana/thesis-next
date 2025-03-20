"use client";

import { TransformedUser, UserProfileModalRef } from "@/types/app-types";
import {
  ChangeEvent,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import BaseModal from "./BaseModal";
import { getUserProfile, updateUser } from "@/lib/server-actions";
import useSWR from "swr";
import RecordNavigation from "../RecordNavigation";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import { useUserIdentifiers } from "@/providers/UserIdentifiersProvider";
import { Loader2 } from "lucide-react";
import { useNotification } from "@/providers/NotificationProvider";
import ShadcnActionButton from "../Buttons/ShadcnActionButton";

const titles: Record<string, string> = {
  users: "Users",
  "external-users": "External Users",
  "hua-users": "Hua Users",
};

const UserProfileModal = forwardRef<UserProfileModalRef>((_, ref) => {
  const [user, setUser] = useState<TransformedUser>();
  const [open, setOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { identifiers, path } = useUserIdentifiers();

  const { isLoading, isValidating, mutate } = useSWR(
    () => value,
    () => getUserProfile(value, path),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setIsEditing(false);
        setUser(res.data);
        setIsEnabled(String(res.data.isEnabled))
      },
      onError: () => {
        setIsEditing(false);
      },
    }
  );

  useImperativeHandle(ref, () => ({
    openDialog: (username) => {
      setOpen(true);
      setValue(username);
      mutate();
    },
  }));

  useEffect(() => {
    if (value) {
      mutate();
    }
  }, [mutate, value]);

  const [pending, setPending] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<string>("");
  const { notify } = useNotification();

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setIsEnabled(value);
  }, []);

  async function handleSubmit() {
    setPending(true);
    const { status } = await updateUser(Number(user?.["id"]), isEnabled, path);

    setIsEditing(false);
    setPending(false);
    if (status === 200) {
      // mutate();
      notify("success", "Changes saved!");
      setOpen(false)
      setTimeout(() => (document.body.style.pointerEvents = ""), 10)
    } else {
      notify("error", "Something went wrong.");
    }
  }

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`${titles[path]} / ${value}`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between pt-4 overflow-hidden"
          tabIndex={-1}
        >
          {/* Profile and navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              <h3 className="font-medium text-sm/[1.5rem]">Profile</h3>
              <RecordNavigation
                list={identifiers}
                value={value}
                setValue={setValue}
              />
            </div>
          </div>

          {/* form */}
          {!user || isLoading || isValidating ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div className="h-full overflow-auto px-4">
              <div
                className="flex flex-col flex-grow justify-between pt-1 overflow-auto text-sm/[1.5rem]"
                tabIndex={-1}
              >
                <form className="space-y-6 bg-white px-6 py-4">
                  <div className="flex flex-row space-x-6">
                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="username"
                        className="flex gap-3 font-medium text-gray-700"
                      >
                        Username
                      </label>
                      <input
                        disabled
                        id="username"
                        name="username"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        placeholder="Enter username"
                        maxLength={256}
                        value={user?.username}
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="email"
                        className="flex gap-3 font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        disabled
                        id="email"
                        name="email"
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        placeholder="Enter email"
                        maxLength={256}
                        value={user?.email}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row space-x-6">
                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="firstName"
                        className="block font-medium text-gray-700"
                      >
                        First Name
                      </label>
                      <input
                        disabled
                        id="firstName"
                        name="firstName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        placeholder="Enter first name"
                        maxLength={256}
                        value={user?.firstName}
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="lastName"
                        className="block font-medium text-gray-700"
                      >
                        Last Name
                      </label>
                      <input
                        disabled
                        id="lastName"
                        name="lastName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        placeholder="Enter last name"
                        maxLength={256}
                        value={user?.lastName}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row space-x-6">
                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="create-external-role-select"
                        className="block font-medium text-gray-700"
                      >
                        Role
                      </label>
                      <input
                        id="create-external-role-select"
                        name="role"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        disabled
                        defaultValue={user?.role.toString()}
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="createdAt"
                        className="block font-medium text-gray-700"
                      >
                        Created At
                      </label>
                      <input
                        disabled
                        id="createdAt"
                        name="createdAt"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        maxLength={256}
                        value={user?.createdAt}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row space-x-6">
                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="lastModified"
                        className="block font-medium text-gray-700"
                      >
                        Last Modified
                      </label>
                      <input
                        disabled
                        id="lastModified"
                        name="lastModified"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        maxLength={256}
                        value={user?.lastModified}
                      />
                    </div>

                    <div className="space-y-1 w-full">
                      <label
                        htmlFor="lastModifiedBy"
                        className="block font-medium text-gray-700"
                      >
                        Last Modified By
                      </label>
                      <input
                        disabled
                        id="lastModifiedBy"
                        name="lastModifiedBy"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                        maxLength={256}
                        value={user?.lastModifiedBy ?? "-"}
                      />
                    </div>
                  </div>

                  <div className="space-y-1 w-fit">
                    <label
                      htmlFor="isEnabled"
                      className="block font-medium text-gray-700"
                    >
                      Is Enabled
                    </label>
                    <select
                      id="isEnabled"
                      name="isEnabled"
                      className="w-full border  px-4 py-3 border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                      onChange={handleChange}
                      value={isEnabled}
                    >
                      <option value="true">TRUE</option>
                      <option value="false">FALSE</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end p-6 rounded-b-md border-t border-t-neutral-300">
            <div className="flex gap-2">
              <ShadcnActionButton
                type="button"
                text={pending ? "Saving..." : "Save"}
                handleClick={handleSubmit}
                disabled={pending}
              />

              <ShadcnActionButton
                type="button"
                text={isEditing ? "Cancel" : "Close"}
                className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
                handleClick={() => setOpen(false)}
                disabled={pending}
              />
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

UserProfileModal.displayName = "UserProfileModal";

export { UserProfileModal };
