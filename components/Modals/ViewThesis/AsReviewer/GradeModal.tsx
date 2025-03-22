"use client";

import { GradeModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "../../BaseModal";
import BaseModalContent from "../../BaseModalContent";
import ModalHeaderWithArrow from "../../ModalHeaderWithArrow";
import { authFetch, customRevalidateTag } from "@/lib/server-actions";
import { useNotification } from "@/providers/NotificationProvider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const GradeModal = forwardRef<
  GradeModalRef,
  { mutate: () => void; initGrade: number }
>(({ mutate, initGrade }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [thesisTitle, setthesisTitle] = useState<string>("");
  const [grade, setGrade] = useState<number>(
    initGrade >= 1 && initGrade >= 10 ? initGrade : 1
  );
  const { notify } = useNotification();

  useImperativeHandle(ref, () => ({
    openDialog: (id, title) => {
      setOpen(true);
      setThesisId(id);
      setthesisTitle(title);
    },
  }));

  const handleSubmit = async () => {
    if (grade === undefined || grade < 1 || grade > 10) {
      notify("error", "Grade must be between 1 and 10.");
      return;
    }

    setPending(true);

    try {
      const { status } = await authFetch(`theses/${thesisId}/grade`, "POST", {
        grade: grade,
      });
      if (status === 200) {
        setPending(false);
        mutate();
        customRevalidateTag("assigned-reviews");
        notify("success", "Thesis graded");
        setOpen(false);
        setTimeout(() => (document.body.style.pointerEvents = ""), 10);
      } else {
        setPending(false);
        notify("error", "Something went wrong");
      }
    } catch {
      setPending(false);
    }
  };

  return (
    <BaseModal open={open} className="bg-transparent">
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <ModalHeaderWithArrow
          setOpen={setOpen}
          title={`Grade / ${thesisTitle}`}
        />
        <div className="pl-10 pt-8 flex flex-col gap-2">
          <div className="space-y-1">
            <label
              htmlFor="grade"
              className="flex gap-1 font-medium text-gray-700"
            >
              Grade
            </label>

            <div className="flex gap-4 items-center">
              <input
                id="grade"
                name="grade"
                type="number"
                min={5}
                max={10}
                step={0.1}
                pattern="\d+(\.\d{1})?"
                className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                placeholder="Enter grade..."
                value={grade}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (value >= 1 && value <= 10) {
                    setGrade(parseFloat(value.toFixed(1)));
                  }
                }}
                required
              />
              <Button onClick={handleSubmit} disabled={pending}>
                {pending ? (
                  <div className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

GradeModal.displayName = "GradeModal";

export { GradeModal };
