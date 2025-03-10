"use client";

import { ApplyForThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import ModalHeaderWithArrow from "./ModalHeaderWithArrow";
import Textarea from "../Textarea";
import Required from "../Required";
import { useNotification } from "@/providers/NotificationProvider";
import { CircleAlert } from "lucide-react";
import { authFetch } from "@/lib/server-actions";

const initErrors = {
  description: "",
  file: "",
};

const ApplyForThesisModal = forwardRef<ApplyForThesisModalRef, { mutate: () => void }>(({ mutate }, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [professorName, setProfessorName] = useState<string>("");

  const [pdf, setPdf] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [errors, setErros] = useState<{ description: string; file: string }>(
    initErrors
  );
  const [pending, setPending] = useState<boolean>(false);

  const { notify } = useNotification();

  useImperativeHandle(ref, () => ({
    openDialog: (id, title, professorName) => {
      setOpen(true);
      setThesisId(id);
      setTitle(title);
      setProfessorName(professorName);
    },
  }));

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErros((prev) => ({...prev, file: ""}))

    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdf(file);
    }
  };

  const handleDescriptionChange = (description: string) => {
    setDescription(description);
  };

  const handlePreview = () => {
    if (pdf) {
      const pdfUrl = URL.createObjectURL(pdf);
      window.open(pdfUrl, "_blank");
    } else {
      notify("error", "No file chosen");
    }
  };

  async function handleSubmit() {
    setPending(true)
    setErros(initErrors)

    if (!pdf) {
      setErros((prev) => ({ ...prev, file: "Grades File Required" }));
      setPending(false)
      return;
    }

    if (
      description === '[{"type":"paragraph","children":[{"text":""}]}]' ||
      !description
    ) {
      setErros((prev) => ({ ...prev, description: "Description Required" }));
      setPending(false)
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdf);
    formData.append("description", description);

    const { data, error, status } = await authFetch(
      `theses/${thesisId}/requests`,
      "PUT",
      null,
      formData
    );

    if (status !== 200) {
      setPending(false)
      notify("error", error ? error : "Something went wrong");
      return;
    }

    setPending(false)
    notify("success", data.message as string);

    setOpen(false)
    mutate()
  }

  return (
    <BaseModal open={open} className="bg-transparent">
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <ModalHeaderWithArrow setOpen={setOpen}  title="Make Request"/>

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
              <div className="space-y-1">
                <div className="flex gap-[2px] font-medium text-gray-700">
                  Description
                  <Required />
                  {errors?.description ? (
                    <span className="flex items-center pl-1 gap-1 text-sm text-red-500">
                      <CircleAlert size={13} /> {errors.description}
                    </span>
                  ) : null}
                </div>
                <Textarea handleDescription={handleDescriptionChange} />
              </div>

              <div className="flex flex-col space-y-1">
                <div className="flex flex-row">
                  <label htmlFor="gradesFile" className="flex gap-[2px]">
                    Upload Grades
                    <Required />
                  </label>
                  {errors?.file ? (
                    <span className="flex items-center pl-1 gap-1 text-sm text-red-500">
                      <CircleAlert size={13} /> {errors.file}
                    </span>
                  ) : null}
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      id="file-input"
                      type="file"
                      accept="application/pdf"
                      // className="w-fit border-b border-b-neutral-400"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div className="flex flex-col items-center gap-2">
                      <label
                        htmlFor="file-input"
                        className="custom-file-button bg-white text-black border border-neutral-400 h-8 items-center flex px-4 rounded cursor-pointer hover:bg-neutral-100"
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
                    <Button
                      type="button"
                      className="h-8"
                      onClick={handlePreview}
                    >
                      Preview
                    </Button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
          <div className="flex justify-end border-t p-6 border-t-neutral-300">
            <div className="pr-2">
              <Button type="button" onClick={() => handleSubmit()} disabled={pending}>
                {pending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ApplyForThesisModal.displayName = "ApplyForThesisModal";

export { ApplyForThesisModal };
