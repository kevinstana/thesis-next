"use client";

import { PublishThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { useNotification } from "@/providers/NotificationProvider";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import { authFetch, customRevalidateTag } from "@/lib/server-actions";

const PublishThesisModal = forwardRef<PublishThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [thesisTitle, setthesisTitle] = useState<string>("");
  const [pdf, setPdf] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file && file.type === "application/pdf") {
      setPdf(file);
    }
  };

  const handlePreview = () => {
    if (pdf) {
      const pdfUrl = URL.createObjectURL(pdf);
      window.open(pdfUrl, "_blank");
    } else {
      notify("error", "No file chosen");
    }
  };

  const { notify } = useNotification();

  useImperativeHandle(ref, () => ({
    openDialog: (id, title) => {
      setOpen(true);
      setThesisId(id);
      setthesisTitle(title);
    },
  }));

  async function handleSubmit() {
    setPending(true);

    if (!pdf) {
      setPending(false);
      notify("error", "File required");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);

    const { status } = await authFetch(
      `theses/${thesisId}/publish`,
      "POST",
      null,
      formData
    );

    if (status === 200) {
      setPending(false);
      notify("success", "Thesis published");
      customRevalidateTag("myAssignment");
      setOpen(false);
      setTimeout(() => (document.body.style.pointerEvents = ""), 10);
    } else {
      setPending(false);
      notify("error", "Something went wrong");
    }
  }

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`My Assignment / ${thesisTitle} / Publish`}
          setOpen={setOpen}
          cleanUp={() => setPdf(null)}
        />
        <div className="pl-10 pt-8 flex flex-col gap-2">
          <div className="flex flex-col space-y-1">
            <div className="flex flex-row">
              <label htmlFor="reportFile" className="flex gap-[2px]">
                Upload Report
              </label>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <input
                  id="file-input"
                  name="reportFile"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center gap-2">
                  <label
                    tabIndex={0}
                    htmlFor="file-input"
                    className="custom-file-button bg-white text-black border border-neutral-400 h-8 items-center flex px-4 rounded cursor-pointer hover:bg-neutral-100"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        document.getElementById("file-input")?.click();
                      }
                    }}
                  >
                    Choose a PDF
                  </label>

                  <span className="text-sm font-medium text-gray-600">
                    {pdf ? pdf.name : "No file selected"}
                  </span>
                  {pdf && (
                    <p className="text-xs text-gray-500">
                      {(pdf.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>

              {pdf ? (
                <div className="flex gap-2 ml-2 items-center">
                  <Button
                    type="button"
                    className="h-8"
                    onClick={handlePreview}
                    disabled={pending}
                  >
                    Preview
                  </Button>
                  <Button
                    type="button"
                    className="h-9 bg-white text-black hover:bg-neutral-200 border border-neutral-300"
                    onClick={handleSubmit}
                    disabled={pending}
                  >
                    {pending ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Saving...
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

PublishThesisModal.displayName = "PublishThesisModal";

export { PublishThesisModal };
