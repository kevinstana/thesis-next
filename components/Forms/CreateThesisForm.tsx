"use client";

import { useState, useRef, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/providers/NotificationProvider";
import { CircleAlert, Loader2 } from "lucide-react";
import { Course } from "@/types/app-types";
import Textarea from "../Textarea";
import { createThesis } from "@/app/theses/actions";
import EditingRecommendedCourses from "../RecommendedCourses/Editing";
import CommitteMember from "../Committee";
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

export default function CreateThesisForm({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
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

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

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
    if (trigger === "add") {
      setExcludedIds((prev) => [...prev, id]);

      switch (label) {
        case "Reviewer 1":
          setBody((prev) => ({
            ...prev,
            secondReviewerId: id,
          }));
          return;
        case "Reviewer 2":
          setBody((prev) => ({
            ...prev,
            thirdReviewerId: id,
          }));
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
        return;
      case "Reviewer 2":
        setBody((prev) => ({
          ...prev,
          thirdReviewerId: 0,
        }));
        return;
      default:
        return;
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

  return (
    <div
      className="flex flex-col flex-grow justify-between p-4 overflow-auto"
      tabIndex={-1}
    >
      <form
        className="space-y-6 bg-white px-6 py-1"
        ref={formRef}
        onSubmit={handleSubmit}
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

        <div className="flex flex-col gap-1">
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

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={pending}>
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
            onClick={() => setOpen(false)}
          >
            Close
          </Button>
        </div>
      </form>
    </div>
  );
}
