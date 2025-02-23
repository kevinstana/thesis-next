import { BasicThesis, ViewThesisModalRef } from "@/types/app-types";
import BodyCell from "./BodyCell";
import View from "@/iconography/View";
import ActionButton from "../Buttons/ActionButton";
import { RefObject } from "react";

export default function Row({
  thesis,
  headers,
  viewThesisModalRef,
}: Readonly<{
  thesis: BasicThesis;
  headers: (keyof BasicThesis)[];
  viewThesisModalRef: RefObject<ViewThesisModalRef>;
}>) {
  return (
    <tr key={thesis.id} className="hover:bg-neutral-100">
      {headers.map((header) => (
        <BodyCell key={header} header={header} cellValue={thesis[header]} />
      ))}
      <td className="sticky right-0 z-50 flex items-center justify-center bg-neutral-100 px-4 py-4 h-[3.25rem] border-r">
        <div className="flex items-center justify-center gap-[0.5rem]">
          <ActionButton
            icon={<View />}
            handleClick={() =>
              viewThesisModalRef.current?.openDialog(thesis.id)
            }
          />
        </div>
      </td>
    </tr>
  );
}
