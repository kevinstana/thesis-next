import { AppUser, UserProfileModalRef } from "@/types/app-types";
import BodyCell from "./BodyCell";
import Pencil from "@/iconography/Pencil";
import { ChangeEvent, RefObject, useCallback, useState } from "react";
import View from "@/iconography/View";
import { clsx } from "clsx";
import CheckMark from "@/iconography/CheckMark";
import Close from "@/iconography/Close";
import ActionButton from "./ActionButton";
import { useNotification } from "@/providers/NotificationProvider";
import { authFetch, updateUser } from "@/lib/server-actions";
import { Loader2 } from "lucide-react";

export default function Row({
  user,
  headers,
  path,
  userProfileModalRef,
}: Readonly<{
  user: AppUser;
  headers: (keyof AppUser)[];
  path: string;
  userProfileModalRef: RefObject<UserProfileModalRef>;
}>) {
  const { notify } = useNotification();
  const [pending, setPending] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = useState<string>(
    user["isEnabled"].toString()
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const viewProfile = (username: string) => {
    userProfileModalRef.current?.openDialog(username);
  };

  const handlePencil = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value } = e.target;

    setIsEnabled(value);
  };

  const handleSubmit = async (id: number, isEnabled: string) => {
    setIsEditing(false);
    setPending(true);

    const { data, status, error } = await updateUser(
      user["id"],
      isEnabled,
      path
    );

    setPending(false);
    if (status === 200) {
      notify("success", "Changes saved!");
    } else {
      notify("error", "Something went wrong.");
    }
  };

  if (pending) {
    return (
      <tr className="bg-neutral-200">
        <td colSpan={headers.length + 1} className="text-center py-4">
          <div className="flex justify-center items-center space-x-2">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr
      key={user.username}
      className={clsx("hover:bg-neutral-100", { "bg-neutral-100": isEditing })}
    >
      {headers.map((header) => (
        <BodyCell
          isEditing={isEditing}
          key={header}
          header={header}
          cellValue={user[header]}
          handleChange={header === "isEnabled" ? handleChange : undefined}
        />
      ))}
      <td
        className={clsx(
          "sticky right-0 z-50 flex items-center justify-center bg-neutral-100 px-4 py-4 h-[3.25rem] border-r"
        )}
      >
        <div className="flex items-center justify-center gap-[0.5rem]">
          <ActionButton
            icon={isEditing ? <CheckMark /> : <Pencil />}
            handleClick={
              isEditing
                ? () => {
                    handleSubmit(user["id"], isEnabled);
                  }
                : () => handlePencil()
            }
          />

          <ActionButton
            icon={isEditing ? <Close /> : <View />}
            handleClick={
              isEditing
                ? () => setIsEditing(false)
                : () => viewProfile(user["username"])
            }
          />
        </div>
      </td>
    </tr>
  );
}
