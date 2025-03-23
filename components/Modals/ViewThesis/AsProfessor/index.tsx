"use client";

import {
  CommitteeMember,
  Course,
  CustomAction,
  DetailedThesisResponse,
  GradeModalRef,
  TasksModalRef,
  ViewThesisModalRef,
} from "@/types/app-types";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BaseModal from "../../BaseModal";
import BaseModalContent from "../../BaseModalContent";
import BaseModalHeader from "../../BaseModalHeader";
import useSWR from "swr";
import RecordNavigation from "../../../RecordNavigation";
import { Loader2 } from "lucide-react";
import { useThesisIdentifiers } from "@/providers/ThesisIdentifiersProvider";
import {
  authFetch,
  customRevalidateTag,
  getOneThesis,
} from "@/lib/server-actions";
import Textarea from "../../../Textarea";
import { Skeleton } from "../../../ui/skeleton";
import ShadcnActionButton from "@/components/Buttons/ShadcnActionButton";
import CommitteMember from "@/components/Committee";
import EditingRecommendedCourses from "@/components/RecommendedCourses/Editing";
import { useNotification } from "@/providers/NotificationProvider";
import Required from "@/components/Required";
import CustomActions from "@/components/Popovers";
import { TasksModal } from "../../Tasks";
import ThesisStatus from "@/components/ThesisStatus";
import { GradeModal } from "../AsReviewer/GradeModal";
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

const committee = [
  { elementId: "reviewer1", label: "Reviewer 1" },
  { elementId: "reviewer2", label: "Reviewer 2" },
];

const ViewThesisModal = forwardRef<ViewThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  const [thesis, setThesis] = useState<DetailedThesisResponse>(currentThesis);
  const [thesisId, setThesisId] = useState<string>("");
  const gradeModalRef = useRef<GradeModalRef>(null);
  const { userId } = useUserDetails();
  const [initCommittee, setInitCommittee] = useState<CommitteeMember[]>([]);

  const tasksModalRef = useRef<TasksModalRef>(null);

  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const { identifiers } = useThesisIdentifiers();

  const { notify } = useNotification();

  const { isLoading, isValidating, mutate } = useSWR(
    thesisId ? `thesis-${thesisId}` : null,
    () => getOneThesis(thesisId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setPending(false);

        const data = res.data as DetailedThesisResponse;
        setThesis(data);
        setInitCommittee([
          {
            id: data.thesis.reviewer1Id,
            firstName: data.thesis.reviewer1FirstName,
            lastName: data.thesis.reviewer1LastName,
            username: "",
          },
          {
            id: data.thesis.reviewer2Id,
            firstName: data.thesis.reviewer2FirstName,
            lastName: data.thesis.reviewer2LastName,
            username: "",
          },
        ]);
        setExcludedIds([
          Number(data.thesis.reviewer1Id),
          Number(data.thesis.reviewer2Id),
        ]);
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
      mutate();
    },
  }));

  function handleCommitteeChange(
    trigger: "add" | "remove",
    id: number,
    label?: string
  ) {
    if (trigger === "add") {
      setExcludedIds((prev) => [...prev, id]);

      switch (label) {
        case "Reviewer 1":
          setThesis((prev) => ({
            ...prev,
            thesis: {
              ...prev.thesis,
              reviewer1Id: id,
            },
          }));
          return;
        case "Reviewer 2":
          setThesis((prev) => ({
            ...prev,
            thesis: {
              ...prev.thesis,
              reviewer2Id: id,
            },
          }));
          return;
        default:
          return;
      }
    }

    setExcludedIds(excludedIds.filter((tmp) => tmp !== id));
    switch (label) {
      case "Reviewer 1":
        setThesis((prev) => ({
          ...prev,
          thesis: {
            ...prev.thesis,
            reviewer1Id: 0,
          },
        }));
        return;
      case "Reviewer 2":
        setThesis((prev) => ({
          ...prev,
          thesis: {
            ...prev.thesis,
            reviewer2Id: 0,
          },
        }));
        return;
      default:
        return;
    }
  }

  function handleCourseChange(trigger: "add" | "remove", course: Course) {
    if (trigger === "add") {
      setThesis((prev) => ({
        ...prev,
        recommendedCourses: [...prev.recommendedCourses, course],
      }));
      return;
    }

    setThesis((prev) => ({
      ...prev,
      recommendedCourses: prev.recommendedCourses.filter((c) => c !== course),
    }));
  }

  async function handleSubmit() {
    const body = {
      title: thesis.thesis.title,
      description: thesis.thesis.description,
      secondReviewerId: String(thesis.thesis.reviewer1Id),
      thirdReviewerId: String(thesis.thesis.reviewer2Id),
      recommendedCourses: thesis.recommendedCourses.map((course) => course.id),
    };

    if (!body.title) {
      notify("error", "Title Required");
      return;
    }

    if (body.secondReviewerId === "0") {
      notify("error", "Reviewer 1 Required");
      return;
    }

    if (body.thirdReviewerId === "0") {
      notify("error", "Reviewer 2 Required");
      return;
    }

    const { data, status } = await authFetch(`theses/${thesisId}`, "PUT", body);

    if (status === 200) {
      notify("success", "Thesis updated!");
      customRevalidateTag("my-theses");
      // mutate();
      setOpen(false);
      setTimeout(() => (document.body.style.pointerEvents = ""), 10);
    } else {
      notify("error", data.message);
    }
  }

  const handleDelete = async () => {
    const { data, status } = await authFetch(`theses/${thesisId}`, "DELETE");

    if (status === 200) {
      notify("success", "Thesis deleted");
    } else {
      notify("error", data.message);
    }

    await customRevalidateTag("my-theses");
    setOpen(false);
    setTimeout(() => (document.body.style.pointerEvents = ""), 10);
  };

  const handleReset = async () => {
    const { data, status } = await authFetch(
      `theses/${thesisId}/reset`,
      "POST"
    );

    if (status === 200) {
      notify("success", "Thesis reset");
    } else {
      notify("error", data.message);
    }

    await customRevalidateTag("my-theses");
    setOpen(false);
    setTimeout(() => (document.body.style.pointerEvents = ""), 10);
  };

  function getCustomActions(status: string): CustomAction[] {
    let customActions: CustomAction[] = [];

    if (status === "AVAILABLE") {
      customActions = [
        ...customActions,
        {
          name: "Delete",
          action: () => {
            if (
              window.confirm("Are you sure you want to delete this thesis?")
            ) {
              handleDelete();
            }
          },
        },
      ];
    }

    if (status !== "PUBLISHED" && status !== "AVAILABLE") {
      customActions = [
        ...customActions,
        {
          name: "Tasks",
          action: () => {
            tasksModalRef.current?.openDialog(thesisId, thesis.thesis.title);
          },
        },
      ];
    }

    if (status === "IN_PROGRESS") {
      customActions = [
        ...customActions,
        {
          name: "Reset",
          action: () => {
            if (window.confirm("Are you sure you want to reset this thesis?")) {
              handleReset();
            }
          },
        },
      ];
    }

    if (status === "PENDING_REVIEW") {
      customActions = [
        ...customActions,
        {
          name: "Grade",
          action: () => {
            gradeModalRef.current?.openDialog(thesisId, thesis.thesis.title);
          },
        },
      ];
    }

    return customActions;
  }

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
          title={`My Theses / ${thesis.thesis.title}`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between px-4 pt-4 overflow-hidden"
          tabIndex={-1}
        >
          {/* navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              {!isLoading || !isValidating ? (
                <ThesisStatus
                  thesis_status={thesis.thesis.status}
                  thesisId={thesisId}
                  mutate={mutate}
                />
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
                    className="flex gap-[2px] font-medium text-gray-700"
                  >
                    Title
                    <Required />
                  </label>
                  <input
                    id="title"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                    maxLength={256}
                    required
                    value={thesis.thesis.title}
                    onChange={(e) => {
                      setThesis((prev) => ({
                        ...prev,
                        thesis: { ...prev.thesis, title: e.target.value },
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex font-medium text-gray-700">
                    Description
                  </div>
                  <Textarea
                    initDescription={thesis.thesis.description}
                    handleDescription={(description: string) => {
                      setThesis((prev) => ({
                        ...prev,
                        thesis: { ...prev.thesis, description },
                      }));
                    }}
                  />
                </div>

                <EditingRecommendedCourses
                  courses={thesis.recommendedCourses}
                  handleCourseChange={handleCourseChange}
                />

                {thesis.thesis.studentId && (
                  <div className="flex flex-col gap-2">
                    <div className="font-medium text-gray-700">Student</div>

                    <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
                      {thesis.thesis.studentFirstName}{" "}
                      {thesis.thesis.studentLastName}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-4">
                  <div className="font-medium text-gray-700">
                    Three-member committee
                  </div>

                  {committee.map((member, index) => (
                    <CommitteMember
                      key={index}
                      elementId={member.elementId}
                      label={member.label}
                      initMember={initCommittee[index]}
                      excludedIds={excludedIds}
                      handleCommitteeChange={handleCommitteeChange}
                    />
                  ))}
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="flex p-6 gap-2 justify-end border border-t-neutral-300">
          <ShadcnActionButton
            type={"submit"}
            text={pending ? "Saving..." : "Save"}
            handleClick={() => handleSubmit()}
            disabled={pending}
          />

          <ShadcnActionButton
            type="button"
            text={"Close"}
            className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
            handleClick={() => setOpen(false)}
            disabled={pending}
          />

          <CustomActions actions={getCustomActions(thesis.thesis.status)} />
          <TasksModal ref={tasksModalRef} />
          <GradeModal
            ref={gradeModalRef}
            initGrade={getInitGrade()}
            mutate={mutate}
            closeParent={() => {
              setOpen(false);
              setTimeout(() => (document.body.style.pointerEvents = ""), 10);
            }}
          />
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ViewThesisModal.displayName = "ViewThesisModal";

export { ViewThesisModal };
