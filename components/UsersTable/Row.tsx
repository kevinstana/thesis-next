import { AppUser, ViewExternalUserModalRef } from "@/types/app-types";
import BodyCell from "./BodyCell";
import Pencil from "@/iconography/Pencil";
import { RefObject, useCallback, useState } from "react";
import View from "@/iconography/View";

export default function Row({
  user,
  headers,
  path,
  viewExternalUserModalRef,
}: Readonly<{
  user: AppUser;
  headers: (keyof AppUser)[];
  path: string;
  viewExternalUserModalRef: RefObject<ViewExternalUserModalRef>;
}>) {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handlePencil = useCallback(() => {
    setIsEditing(!isEditing);
  }, [isEditing]);

  return (
    <tr key={user.username}
    className="hover:bg-neutral-100">
      {headers.map((header) => (
        <BodyCell
          isEditing={isEditing}
          key={header}
          header={header}
          cellValue={user[header]}
        />
      ))}
      <td className="sticky right-0 z-50 flex items-center justify-center bg-neutral-100 px-4 py-4 h-[3.25rem] border-r">
        <div className="flex items-center justify-center gap-[0.5rem]">
          <button
            className="p-2 rounded-lg hover:bg-neutral-200"
            onClick={() => {alert(isEditing); handlePencil()}}
          >
            <Pencil />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-neutral-200"
            onClick={() => {
              if (path === "external-users") {
                viewExternalUserModalRef.current?.openDialog(user["username"]);
              }
            }}
          >
            <View />
          </button>
        </div>
      </td>
    </tr>
  );
}
