"use client";

import { AppUser, UserProfileModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import { getUserProfile } from "@/lib/server-actions";
import useSWR from "swr";
import RecordNavigation from "../RecordNavigation";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import { useUserDetails } from "@/providers/UserIdentifiersProvider";
import { Button } from "../ui/button";
import { dateFormatter } from "@/lib/utils";
import UserProfileSkeleton from "../Skeletons/UserProfileSkeleton";

const titles: Record<string, string> = {
  users: "Users",
  "external-users": "External Users",
  "hua-users": "Hua Users",
};

const UserProfileModal = forwardRef<UserProfileModalRef>((_, ref) => {
  const [user, setUser] = useState<AppUser>();
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>("");
  const { identifiers, path } = useUserDetails();

  const { isLoading } = useSWR(
    () => value,
    () => getUserProfile(value, path),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => setUser(res.data),
      onError: () => console.log("error"),
    }
  );

  useImperativeHandle(ref, () => ({
    openDialog: (username) => {
      setOpen(true);
      setValue(username);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-full max-w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`${titles[path]} / ${value}`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between p-4 overflow-hidden"
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
          {!user || isLoading ? (
            <UserProfileSkeleton />
          ) : (
            <div className="h-full overflow-auto">
              <div
                className="flex flex-col flex-grow justify-between pt-4 overflow-auto text-sm/[1.5rem]"
                tabIndex={-1}
              >
                <form className="space-y-6 bg-white px-6 py-1">
                  <div className="space-y-1">
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

                  <div className="space-y-1">
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

                  <div className="space-y-1">
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

                  <div className="space-y-1">
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

                  <div className="space-y-1">
                    <label
                      htmlFor="create-external-role-select"
                      className="block font-medium text-gray-700"
                    >
                      Role
                    </label>
                    <select
                      id="create-external-role-select"
                      name="role"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                      disabled
                      defaultValue={user?.role.toString()}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="STUDENT">Student</option>
                      <option value="PROFESSOR">Professor</option>
                      <option value="SECRETARY">Secretary</option>
                    </select>
                  </div>

                  <div className="space-y-1">
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
                      value={dateFormatter(String(user?.createdAt))}
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="lastModifiedBy"
                      className="block font-medium text-gray-700"
                    >
                      Last Mofified By
                    </label>
                    <input
                      disabled
                      id="lastModifiedBy"
                      name="lastModifiedBy"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                      placeholder="Enter last name"
                      maxLength={256}
                      value={user?.lastModifiedBy}
                    />
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="submit">Save</Button>
                    <Button
                      type="button"
                      className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

UserProfileModal.displayName = "UserProfileModal";

export { UserProfileModal };
