"use client";

import { Course, CreateThesisModalRef } from "@/types/app-types";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import CreateThesisButton from "../Buttons/CreateThesisButton";
import { useNotification } from "@/providers/NotificationProvider";
import { createThesis } from "@/app/theses/actions";
import { Button } from "../ui/button";
import { CircleAlert, Loader2 } from "lucide-react";
import CommitteMember from "../Committee";
import EditingRecommendedCourses from "../RecommendedCourses/Editing";
import Textarea from "../Textarea";
import Required from "../Required";

export type CreateThesisBody = {
  title: string;
  description: string;
  secondReviewerId: number;
  thirdReviewerId: number;
  recommendedCourses: number[];
};

const initialBody = {
  title: "",
  description: "",
  secondReviewerId: 0,
  thirdReviewerId: 0,
  recommendedCourses: [],
};

const initialErrors = {
  title: "",
  secondReviewerId: "",
  thirdReviewerId: "",
};

const committee = [
  { elementId: "reviewer1", label: "Reviewer 1" },
  { elementId: "reviewer2", label: "Reviewer 2" },
];

const CreateThesisModal = forwardRef<CreateThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const { notify } = useNotification();
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState(initialErrors);

  const [body, setBody] = useState<CreateThesisBody>(initialBody);
  const handleDescription = useCallback((description: string) => {
    setBody((prev) => ({ ...prev, description }));
  }, []);

  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  async function handleSubmit() {
    setPending(true);

    if (!body.title) {
      setPending(false);
      setErrors({ ...errors, title: "Title required" });
      return;
    }

    if (!body.secondReviewerId) {
      setPending(false);
      setErrors({ ...errors, secondReviewerId: "Reviewer 1 required" });
      return;
    }

    if (!body.thirdReviewerId) {
      setPending(false);
      setErrors({ ...errors, thirdReviewerId: "Reviewer 2 required" });
      return;
    }

    const res = await createThesis(body, "my-theses");
    if (res.status === 200) {
      setPending(false);
      notify("success", "Thesis created!");
      setErrors(initialErrors);
      formRef.current?.reset();
      setSelectedCourses([]);
      setBody(initialBody);
      setExcludedIds([]);
      window.dispatchEvent(new Event("ClearForm"));
      setOpen(false);
      setTimeout(() => (document.body.style.pointerEvents = ""), 10);
      return;
    }

    if (res.error === "A thesis with this title already exists.") {
      setPending(false);
      setErrors({
        title: String(res.error),
        secondReviewerId: "",
        thirdReviewerId: "",
      });
    }

    if (res.status !== 200) {
      setPending(false);
      setErrors({
        title: "",
        secondReviewerId: "",
        thirdReviewerId: "",
      });
      notify("error", res.data.message);
    }
  }

  function handleCommitteeChange(
    trigger: "add" | "remove",
    id: number,
    label?: string
  ) {
    const committeeInput = document.getElementsByName("committee-member");
    const saveButton = document.getElementById("save-button");

    if (trigger === "add") {
      setExcludedIds((prev) => [...prev, id]);

      switch (label) {
        case "Reviewer 1":
          setBody((prev) => ({
            ...prev,
            secondReviewerId: id,
          }));
          if (committeeInput.length > 0) {
            committeeInput[committeeInput.length - 1].focus();
          }
          return;
        case "Reviewer 2":
          setBody((prev) => ({
            ...prev,
            thirdReviewerId: id,
          }));
          if (committeeInput.length > 0) {
            committeeInput[0].focus();
          }

          if (committeeInput.length === 1) {
            saveButton?.focus();
          }

          return;
        default:
          return;
      }
    }

    setExcludedIds(excludedIds.filter((tmp) => tmp !== id));
    switch (label) {
      case "Reviewer 1":
        setBody((prev) => ({
          ...prev,
          secondReviewerId: 0,
        }));
        break;
      case "Reviewer 2":
        setBody((prev) => ({
          ...prev,
          thirdReviewerId: 0,
        }));
        break;
      default:
        break;
    }
  }

  function handleCourseChange(trigger: "add" | "remove", course: Course) {
    if (trigger === "add") {
      setSelectedCourses(([...prev]) => [...prev, course]);
      setBody((prev) => ({
        ...prev,
        recommendedCourses: [...selectedCourses, course].map(
          (course) => course.id
        ),
      }));
      return;
    }

    setSelectedCourses(selectedCourses.filter((c) => c !== course));
    setBody((prev) => ({
      ...prev,
      recommendedCourses: selectedCourses
        .filter((c) => c !== course)
        .map((crs) => crs.id),
    }));
  }

  useImperativeHandle(ref, () => ({
    openDialog: () => {
      setOpen(true);
    },
  }));

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-full max-w-[60%] h-[90%] rounded-lg flex flex-col relative">
        <BaseModalHeader
          title="Create Thesis"
          setOpen={setOpen}
          cleanUp={() => {
            setSelectedCourses([]);
            setBody(initialBody);
          }}
        />

        <div
          className="flex flex-col flex-grow justify-between overflow-hidden"
          tabIndex={-1}
        >
          <form
            className="space-y-6 bg-white px-10 py-5 overflow-auto"
            ref={formRef}
          >
            <div className="space-y-1">
              <label
                htmlFor="title"
                className="flex gap-1 font-medium text-gray-700"
              >
                Title
                <Required />
                {errors?.title && (
                  <span className="flex items-center gap-1 text-sm text-red-500">
                    <CircleAlert size={13} /> {errors.title}
                  </span>
                )}
              </label>
              <input
                id="title"
                name="title"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                placeholder="Enter Title"
                maxLength={256}
                onChange={(e) =>
                  setBody((prev) => ({ ...prev, title: e.target.value }))
                }
                required
              />
            </div>

            <div className="flex flex-col gap-1" tabIndex={-1}>
              <div className="flex gap-[2px] font-medium text-gray-700">
                Description
              </div>
              <Textarea handleDescription={handleDescription} />
            </div>

            <EditingRecommendedCourses
              courses={selectedCourses}
              handleCourseChange={handleCourseChange}
            />

            {committee.map((member, index) => (
              <CommitteMember
                key={index}
                elementId={member.elementId}
                label={member.label}
                excludedIds={excludedIds}
                handleCommitteeChange={handleCommitteeChange}
                errors={errors}
                initMember={null}
              />
            ))}
          </form>

          <div className="flex flex-wrap items-center justify-end p-6 rounded-b-md border-t border-t-neutral-300">
            <div className="flex gap-2 justify-end">
              <Button
                id="save-button"
                type="button"
                disabled={pending}
                onClick={handleSubmit}
              >
                {pending ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </div>
                ) : (
                  "Save"
                )}
              </Button>
              <Button
                type="button"
                className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
                onClick={() => {
                  setSelectedCourses([]);
                  setBody(initialBody);
                  setOpen(false);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

CreateThesisModal.displayName = "CreateThesisModal";

export default function CreateThesisModalModalWrapper() {
  const createThesisModalRef = useRef<CreateThesisModalRef>(null);

  return (
    <>
      <CreateThesisButton modalRef={createThesisModalRef} />
      <CreateThesisModal ref={createThesisModalRef} />
    </>
  );
}
