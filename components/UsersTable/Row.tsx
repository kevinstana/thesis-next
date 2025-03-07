import {
  AppUser,
  TransformedUser,
  UserProfileModalRef,
} from "@/types/app-types";
import BodyCell from "./BodyCell";
import { RefObject } from "react";
import View from "@/iconography/View";
import { clsx } from "clsx";
import ActionButton from "../Buttons/ActionButton";

export default function Row({
  user,
  headers,
  userProfileModalRef,
}: Readonly<{
  user: TransformedUser;
  headers: (keyof AppUser)[];
  userProfileModalRef: RefObject<UserProfileModalRef>;
}>) {
  const viewProfile = (username: string) => {
    userProfileModalRef.current?.openDialog(username);
  };

  return (
    <tr key={user.username} className={clsx("hover:bg-neutral-100")}>
      {headers.map((header) => (
        <BodyCell key={header} header={header} cellValue={user[header]} />
      ))}
      <td className="sticky right-0 z-50 flex items-center justify-center bg-neutral-100 px-4 py-4 h-[3.25rem] border-r">
        <div className="flex items-center justify-center gap-[0.5rem]">
          <ActionButton
            icon={<View />}
            handleClick={() => viewProfile(user["username"])}
          />
        </div>
      </td>
    </tr>
  );
}
