import {
  BasicThesis,
  GeneralViewThesisModalRef,
  ThesisRequestsModalRef,
  ViewThesisModalRef,
} from "@/types/app-types";
import BodyCell from "./BodyCell";
import View from "@/iconography/View";
import ActionButton from "../Buttons/ActionButton";
import { RefObject } from "react";
import { Bell } from "lucide-react";

export default function Row({
  thesis,
  headers,
  viewThesisModalRef,
  thesisRequestsModalRef,
}: Readonly<{
  thesis: BasicThesis;
  headers: (keyof BasicThesis)[];
  viewThesisModalRef: RefObject<ViewThesisModalRef | GeneralViewThesisModalRef>;
  thesisRequestsModalRef?: RefObject<ThesisRequestsModalRef> | null;
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

          {thesisRequestsModalRef && thesis.status === "AVAILABLE" ? (
            <ActionButton
              icon={<Bell size={16} color="#2B555F" />}
              handleClick={() => {
                thesisRequestsModalRef?.current?.openDialog(thesis.id, thesis.title);
              }}
            />
          ) : null}
        </div>
      </td>
    </tr>
  );
}
