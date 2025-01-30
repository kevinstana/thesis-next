import { TransformedUser } from "@/types/app-types";
import ShadcnActionButton from "./Buttons/ShadcnActionButton";
import { ChangeEvent, useCallback, useState } from "react";
import { useNotification } from "@/providers/NotificationProvider";
import { updateUser } from "@/lib/server-actions";

export default function UserProfile({
  user,
  isEditing,
  setIsEditing,
  setOpen,
  mutate,
  path,
}: Readonly<{
  user: TransformedUser;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  setOpen: (value: boolean) => void;
  mutate: () => void;
  path: string;
}>) {
  const [pending, setPending] = useState<boolean>(false);
  const [isEnabled, seIsEnabled] = useState<string>(String(user.isEnabled));
  const { notify } = useNotification();

  const handleChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    seIsEnabled(value);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const { status } = await updateUser(user["id"], isEnabled, path);

    setIsEditing(false);
    setPending(false);
    if (status === 200) {
      mutate();
      notify("success", "Changes saved!");
    } else {
      notify("error", "Something went wrong.");
    }
  }

  return (
    <div className="h-full overflow-auto">
      <div
        className="flex flex-col flex-grow justify-between pt-1 overflow-auto text-sm/[1.5rem]"
        tabIndex={-1}
      >
        <form className="space-y-6 bg-white px-6 py-1" onSubmit={handleSubmit}>
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

          <div className="space-y-1">
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
              value={user?.createdAt}
            />
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
                placeholder="Enter last name"
                maxLength={256}
                value={user?.lastModifiedBy}
              />
            </div>
          </div>

          <div className="space-y-1 w-full">
            <label
              htmlFor="isEnabled"
              className="block font-medium text-gray-700"
            >
              Is Enabled
            </label>
            {isEditing ? (
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
            ) : (
              <input
                disabled={!isEditing}
                id="isEnabled"
                name="isEnabled"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                value={String(user?.isEnabled).toUpperCase()}
              />
            )}
          </div>

          <div className="flex pb-8 pt-2 gap-2 justify-end">
            <ShadcnActionButton
              type={isEditing ? "button" : "submit"}
              text={pending ? "Saving..." : isEditing ? "Save" : "Edit"}
              handleClick={
                isEditing ? () => setIsEditing(false) : () => setIsEditing(true)
              }
              disabled={pending}
            />

            <ShadcnActionButton
              type="button"
              text={isEditing ? "Cancel" : "Close"}
              className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
              handleClick={
                isEditing ? () => setIsEditing(false) : () => setOpen(false)
              }
              disabled={pending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
