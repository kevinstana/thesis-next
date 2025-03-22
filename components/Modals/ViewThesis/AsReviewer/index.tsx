"use client";

import {
  DetailedThesisResponse,
  GradeModalRef,
  ReviewerThesisModalRef,
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
import ShadcnActionButton from "@/components/Buttons/ShadcnActionButton";
import { GradeModal } from "./GradeModal";
import { useUserDetails } from "@/providers/UserDetailsProvier";

const currentThesis: DetailedThesisResponse = {
  thesis: {
    id: "",
    title: "",
    description: "",

    professorId: 0,
    professorFirstName: "",
    professorLastName: "",
    professorGrade: 0,

    reviewer1Id: 0,
    reviewer1FirstName: "",
    reviewer1LastName: "",
    reviewer1Grade: 0,

    reviewer2Id: 0,
    reviewer2FirstName: "",
    reviewer2LastName: "",
    reviewer2Grade: 0,

    studentId: 0,
    studentFirstName: "",
    studentLastName: "",

    status: "",
  },
  recommendedCourses: [],
  canMakeRequest: false,
  hasMadeRequest: false,
};

const ReviewerThesisModal = forwardRef<ReviewerThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const gradeModalRef = useRef<GradeModalRef>(null);
  const { identifiers } = useThesisIdentifiers();
  const { userId } = useUserDetails();
  const [thesis, setThesis] = useState<DetailedThesisResponse>(currentThesis);

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

  function getInitGrade() {
    if (Number(userId) === thesis.thesis.professorId) {
      return thesis.thesis.professorGrade;
    } else if (Number(userId) === thesis.thesis.reviewer1Id) {
      return thesis.thesis.reviewer1Grade;
    }

    return thesis.thesis.reviewer2Grade;
  }

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`Theses / ${thesis.thesis.title}`}
          setOpen={setOpen}
        />

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
                    },
                    {
                      "bg-blue-500/20 text-blue-500":
                        thesis.thesis.status === "IN_PROGRESS",
                    },
                    {
                      "bg-gray-500/20 text-gray-500":
                        thesis.thesis.status === "PENDING_REVIEW",
                    },
                    {
                      "bg-purple-500/20 text-purple-500":
                        thesis.thesis.status === "REVIEWED",
                    },
                    {
                      "bg-yellow-500/20 text-yellow-500":
                        thesis.thesis.status === "PUBLISHED",
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

                <div className="flex flex-col gap-1">
                  <div className="flex gap-[2px] font-medium text-gray-700">
                    Description
                  </div>
                  <Textarea
                    initDescription={thesis.thesis.description}
                    readonly
                  />
                </div>

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

                {thesis.thesis.studentId ? (
                  <>
                    <div className="flex flex-row gap-8">
                      {/* student */}
                      <div className="space-y-1">
                        <div className="flex gap-3 text-sm text-gray-700">
                          Student
                        </div>
                        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                          {`${thesis.thesis.studentFirstName} ${thesis.thesis.studentLastName}`}
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </form>
            </div>
          )}
        </div>
        {thesis.thesis.status === "PENDING_REVIEW" && (
          <div className="flex p-6 gap-2 justify-end border border-t-neutral-300">
            <ShadcnActionButton
              type="button"
              text="Grade"
              handleClick={() =>
                gradeModalRef.current?.openDialog(thesisId, thesis.thesis.title)
              }
            />

            <GradeModal ref={gradeModalRef} initGrade={getInitGrade()} mutate={mutate} />
          </div>
        )}
      </BaseModalContent>
    </BaseModal>
  );
});

ReviewerThesisModal.displayName = "ReviewerThesisModal";

export { ReviewerThesisModal };
