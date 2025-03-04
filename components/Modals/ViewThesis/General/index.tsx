"use client";

import { DetailedThesis, GeneralViewThesisModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import BaseModal from "../../BaseModal";
import BaseModalContent from "../../BaseModalContent";
import BaseModalHeader from "../../BaseModalHeader";
import useSWR from "swr";
import RecordNavigation from "../../../RecordNavigation";
import { Loader2 } from "lucide-react";
import { useThesisIdentifiers } from "@/providers/ThesisIdentifiersProvider";
import { getOneThesis } from "@/lib/server-actions";
import Textarea from "../../../Textarea";
import RecommendedCourses from "../../../RecommendedCourses";
import { clsx } from "clsx";
import { Skeleton } from "../../../ui/skeleton";

const initThesis: DetailedThesis = {
  id: "",
  title: "",
  description: "",
  professorFullName: "",
  reviewer1FullName: "",
  reviewer2FullName: "",
  professorId: "",
  reviewer1Id: "",
  reviewer2Id: "",
  status: "",
};

const GeneralViewThesisModal = forwardRef<GeneralViewThesisModalRef>(
  (_, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [thesisId, setThesisId] = useState<string>("");
    const { identifiers } = useThesisIdentifiers();
    const [thesis, setThesis] = useState<DetailedThesis>(initThesis);

    const { data, isLoading, isValidating, mutate } = useSWR(
      thesisId ? `thesis-${thesisId}` : null,
      () => getOneThesis(thesisId),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        onSuccess: (res) => {
          setThesis(res.data);
        },
      }
    );

    // Reset thesis state when thesisId changes
    useEffect(() => {
      setThesis(initThesis);
      if (thesisId) {
        mutate(); // Fetch fresh data
      }
    }, [thesisId, mutate]);

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
            className="flex flex-col flex-grow justify-between px-4 py-4 overflow-hidden"
            tabIndex={-1}
          >
            {/* navigation */}
            <div className="flex flex-col px-6 py-2">
              <div className="flex w-full justify-between">
                {!isLoading && !isValidating ? (
                  <div
                    className={clsx(
                      "font-medium text-sm/[1.5rem] rounded-full px-2 py-1 w-fit",
                      {
                        "bg-green-500/20 text-green-500":
                          thesis.status === "AVAILABLE",
                      }
                    )}
                  >
                    {thesis.status}
                  </div>
                ) : (
                  <Skeleton className="rounded-full px-2 py-1 w-24 h-8" />
                )}
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
                      value={thesis.title}
                    />
                  </div>

                  <Textarea initDescription={thesis.description} readonly />

                  <RecommendedCourses thesisId={thesisId} type="viewing" />

                  <div className="flex flex-col gap-4">
                    <div className="font-medium text-gray-700">
                      Three-member committee
                    </div>
                    <div className="flex flex-row gap-8">
                      {/* Professor */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Professor
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {thesis.professorFullName}
                        </div>
                      </div>

                      {/* Reviewer 1 Field */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Reviewer 1
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {thesis.reviewer1FullName}
                        </div>
                      </div>

                      {/* Reviewer 2 Field */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Reviewer 2
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {thesis.reviewer2FullName}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </BaseModalContent>
      </BaseModal>
    );
  }
);

GeneralViewThesisModal.displayName = "GeneralViewThesisModal";

export { GeneralViewThesisModal };
