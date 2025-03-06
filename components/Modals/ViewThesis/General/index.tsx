"use client";

import {
  ApplyForThesisModalRef,
  DetailedThesisResponse,
  GeneralViewThesisModalRef,
} from "@/types/app-types";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useRef,
} from "react";
import BaseModal from "../../BaseModal";
import BaseModalContent from "../../BaseModalContent";
import BaseModalHeader from "../../BaseModalHeader";
import useSWR from "swr";
import RecordNavigation from "../../../RecordNavigation";
import { Loader2 } from "lucide-react";
import { useThesisIdentifiers } from "@/providers/ThesisIdentifiersProvider";
import { getOneThesis } from "@/lib/server-actions";
import Textarea from "../../../Textarea";
import { clsx } from "clsx";
import { Skeleton } from "../../../ui/skeleton";
import ViewingRecommendedCourses from "@/components/RecommendedCourses/Viewing";
import { Button } from "@/components/ui/button";
import { ApplyForThesisModal } from "../../ApplyForThesisModal";

const currentThesis: DetailedThesisResponse = {
  thesis: {
    id: "",
    title: "",
    description: "",

    professorId: 0,
    professorFirstName: "",
    professorLastName: "",

    reviewer1Id: 0,
    reviewer1FirstName: "",
    reviewer1LastName: "",

    reviewer2Id: 0,
    reviewer2FirstName: "",
    reviewer2LastName: "",
    status: "",
  },
  recommendedCourses: [],
};

const GeneralViewThesisModal = forwardRef<GeneralViewThesisModalRef>(
  (_, ref) => {
    const [open, setOpen] = useState<boolean>(false);
    const [thesisId, setThesisId] = useState<string>("");
    const { identifiers } = useThesisIdentifiers();
    const [thesis, setThesis] = useState<DetailedThesisResponse>(currentThesis);
    const applyForThesisModalRef = useRef<ApplyForThesisModalRef>(null);

    const { isLoading, isValidating, mutate } = useSWR(
      thesisId ? `thesis-${thesisId}` : null,
      () => getOneThesis(thesisId),
      {
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        onSuccess: (res) => {
          setThesis(res.data as DetailedThesisResponse);
        },
      }
    );

    useEffect(() => {
      setThesis(currentThesis);
      if (thesisId) {
        mutate();
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
            className="flex flex-col flex-grow justify-between overflow-hidden"
            tabIndex={-1}
          >
            {/* navigation */}
            <div className="flex flex-col px-8 py-4">
              <div className="flex w-full justify-between">
                {!isLoading && !isValidating ? (
                  <div
                    className={clsx(
                      "font-medium text-sm/[1.5rem] rounded-full px-2 py-1 w-fit",
                      {
                        "bg-green-500/20 text-green-500":
                          thesis.thesis.status === "AVAILABLE",
                      }
                    )}
                  >
                    {thesis.thesis.status}
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
                      value={thesis.thesis.title}
                    />
                  </div>

                  <Textarea
                    initDescription={thesis.thesis.description}
                    readonly
                  />

                  <ViewingRecommendedCourses
                    courses={thesis.recommendedCourses}
                  />

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
                          {`${thesis.thesis.professorFirstName} ${thesis.thesis.professorLastName}`}
                        </div>
                      </div>

                      {/* Reviewer 1 Field */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Reviewer 1
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {`${thesis.thesis.reviewer1FirstName} ${thesis.thesis.reviewer1LastName}`}
                        </div>
                      </div>

                      {/* Reviewer 2 Field */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Reviewer 2
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {`${thesis.thesis.reviewer2FirstName} ${thesis.thesis.reviewer2LastName}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            )}
            <div className="flex justify-end border-t p-6 border-t-neutral-300">
              <div className="pr-2">
                <Button
                  onClick={() => {
                    applyForThesisModalRef.current?.openDialog(
                      thesisId,
                      thesis.thesis.title,
                      `${thesis.thesis.professorFirstName} ${thesis.thesis.professorLastName}`
                    );
                  }}
                >
                  Make Request
                </Button>
              </div>
            </div>
          </div>
          <ApplyForThesisModal ref={applyForThesisModalRef} />
        </BaseModalContent>
      </BaseModal>
    );
  }
);

GeneralViewThesisModal.displayName = "GeneralViewThesisModal";

export { GeneralViewThesisModal };
