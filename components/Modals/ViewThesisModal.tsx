"use client";

import { DetailedThesis, ViewThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import useSWR from "swr";
import RecordNavigation from "../RecordNavigation";
import { Loader2 } from "lucide-react";
import { useThesisIdentifiers } from "@/providers/ThesisIdentifiersProvider";
import { getOneThesis } from "@/lib/server-actions";
import Textarea from "../Textarea";
import { Button } from "../ui/button";
import RecommendedCourses from "../RecommendedCourses";
import { clsx } from "clsx";

const initThesis: DetailedThesis = {
  id: "",
  title: "",
  description: "",
  professorFullName: "",
  reviewer1FullName: "",
  reviewer2FullName: "",
  status: "",
};

const ViewThesisModal = forwardRef<ViewThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const { identifiers } = useThesisIdentifiers();
  const [thesis, setThesis] = useState<DetailedThesis>(initThesis);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const { isLoading, isValidating, mutate } = useSWR(
    () => thesisId,
    () => getOneThesis(thesisId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setIsEditing(false);
        setThesis(res.data);
      },
      onError: () => {
        setIsEditing(false);
      },
    }
  );

  useImperativeHandle(ref, () => ({
    openDialog: (id) => {
      setOpen(true);
      setThesisId(id);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader title={`Theses / ${thesisId}`} setOpen={setOpen} />

        <div
          className="flex flex-col flex-grow justify-between px-4 pt-4 overflow-hidden"
          tabIndex={-1}
        >
          {/* navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              <h3 className="font-medium text-sm/[1.5rem]">Thesis</h3>
              <div>
                <RecordNavigation
                  list={identifiers}
                  value={thesisId}
                  setValue={setThesisId}
                />
              </div>
            </div>
          </div>

          {/* form */}
          {isLoading || isValidating ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div
              className="flex flex-col flex-grow p-4 overflow-auto"
              tabIndex={-1}
            >
                <div className="flex justify-end text-sm pr-6">
                  <div
                    className={clsx("rounded-full px-2 py-1 w-fit", {
                      "bg-green-500/20 text-green-500":
                        thesis.status === "AVAILABLE",
                    })}
                  >
                    {thesis.status}
                  </div>
                </div>
              <form className="space-y-6 bg-white px-6 py-1">
                <div className="space-y-1">
                  <label
                    htmlFor="title"
                    className="flex gap-3 font-medium text-gray-700"
                  >
                    Title
                  </label>
                  <input
                    disabled
                    id="title"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                    maxLength={256}
                    required
                    value={thesis.title}
                  />
                </div>

                <Textarea initDescription={thesis.description} />

                <RecommendedCourses thesisId={thesisId} />

                <div className="flex flex-col gap-4">
                  <div className="font-medium text-gray-700">
                    Three-member committee
                  </div>
                  <div className="flex flex-row gap-8">
                    {/* Professor */}
                    <div className="space-y-1">
                      <label className="flex gap-3 text-sm text-gray-700">
                        Professor
                      </label>
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                        {thesis.professorFullName}
                      </div>
                    </div>

                    {/* Reviewer 1 Field */}
                    <div className="space-y-1">
                      <label className="flex gap-3 text-sm text-gray-700">
                        Reviewer 1
                      </label>
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                        {thesis.reviewer1FullName}
                      </div>
                    </div>

                    {/* Reviewer 2 Field */}
                    <div className="space-y-1">
                      <label className="flex gap-3 text-sm text-gray-700">
                        Reviewer 2
                      </label>
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                        {thesis.reviewer2FullName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button type="submit">
                    {0 === 1 / 2 ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Saving...
                      </div>
                    ) : (
                      "Save"
                    )}
                  </Button>
                  <Button
                    type="button"
                    className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ViewThesisModal.displayName = "ViewThesisModal";

export { ViewThesisModal };
