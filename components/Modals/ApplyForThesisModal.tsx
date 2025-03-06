"use client";

import { ApplyForThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import ModalHeaderWithArrow from "./ModalHeaderWithArrow";
import Textarea from "../Textarea";
import Required from "../Required";

const ApplyForThesisModal = forwardRef<ApplyForThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [professorName, setProfessorName] = useState<string>("");

  const [pdf, setPdf] = useState<File | null>(null);

  useImperativeHandle(ref, () => ({
    openDialog: (id, title, professorName) => {
      setOpen(true);
      setThesisId(id);
      setTitle(title);
      setProfessorName(professorName);
    },
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
    }
  };

  const handlePreview = () => {
    if (pdf) {
      const pdfUrl = URL.createObjectURL(pdf);
      window.open(pdfUrl, "_blank");
    } else {
      alert("No file uploaded");
    }
  };

  return (
    <BaseModal open={open} className="bg-transparent">
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <ModalHeaderWithArrow setOpen={setOpen} />

        <div
          className="flex flex-col flex-grow justify-between overflow-hidden pt-4"
          tabIndex={-1}
        >
          <div className="flex flex-col px-8 py-2 gap-8">
            <div className="flex w-full justify-between">
              <div className="flex flex-col px-2 py-1 gap-3">
                <div className="flex flex-col">
                  <h3 className="text-neutral-600">Title:</h3>
                  <p>{title}</p>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-neutral-600">Professor:</h3>
                  <p>{professorName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* form */}
          <div
            className="flex flex-col flex-grow p-4 overflow-auto gap-2"
            tabIndex={-1}
          >
            <h3 className="px-6">Please fill the following information:</h3>
            <form className="space-y-6 bg-white px-6 py-1">
              <div>
                <div className="flex gap-[2px] font-medium text-gray-700">
                  Description<Required />
                </div>
                <Textarea />
              </div>

              <div className="flex flex-col space-y-1">
                <label htmlFor="gradesFile" className="flex gap-[2px]">Uplaod Grades<Required /></label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="w-fit border border-neutral-700"
                    onChange={handleFileChange}
                  />
                  <Button type="button" className="h-8" onClick={handlePreview}>
                    Preview
                  </Button>
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-end border-t p-6 border-t-neutral-300">
            <div className="pr-2">
              <Button>Save</Button>
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ApplyForThesisModal.displayName = "ApplyForThesisModal";

export { ApplyForThesisModal };
