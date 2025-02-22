"use client";

import { useState, useRef, FormEvent, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/providers/NotificationProvider";
import { CircleAlert, Loader2, Plus, X } from "lucide-react";
import { AppUser, Course } from "@/types/app-types";
import { authFetch } from "@/lib/server-actions";
import Textarea from "../Textarea";
import { createThesis } from "@/app/theses/actions";

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
  thirdReviewerId: ""
}

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

  const [showCourseSearch, setShowCourseSearch] = useState(false);
  const [courseQuery, setCourseQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [queryCourses, setQueryCourses] = useState<Course[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // States for Reviewer 1
  const [reviewer1Query, setReviewer1Query] = useState("");
  const [selectedReviewer1, setSelectedReviewer1] = useState<AppUser | null>();
  const [queryReviewers1, setQueryReviewers1] = useState<AppUser[]>([]);
  const [highlightedReviewer1Index, setHighlightedReviewer1Index] = useState(0);

  // States for Reviewer 2
  const [reviewer2Query, setReviewer2Query] = useState("");
  const [selectedReviewer2, setSelectedReviewer2] = useState<AppUser | null>();
  const [queryReviewers2, setQueryReviewers2] = useState<AppUser[]>([]);
  const [highlightedReviewer2Index, setHighlightedReviewer2Index] = useState(0);

  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  async function handleQuery(query: string) {
    setCourseQuery(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(`courses?name=${query}`, "POST", {
      selectedCourses: selectedCourses.map((course) => course.name),
    });
    setQueryCourses(data);
  }

  function handleAddCourse(course: Course) {
    setBody((prev) => ({
      ...prev,
      recommendedCourses: [...selectedCourses, course].map(
        (course) => course.id
      ),
    }));
    setSelectedCourses([...selectedCourses, course]);
    setQueryCourses([]);
    setShowCourseSearch(false);
    setCourseQuery("");
    setHighlightedIndex(0);
  }

  function handleRemoveCourse(course: Course) {
    setBody((prev) => ({
      ...prev,
      recommendedCourses: selectedCourses
        .filter((c) => c !== course)
        .map((crs) => crs.id),
    }));
    setSelectedCourses(selectedCourses.filter((c) => c !== course));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (queryCourses.length === 0) return;

    // Prevent default behavior (like caret movement) on arrow keys
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedIndex + 1) % queryCourses.length;
      setHighlightedIndex(newIndex);
      focusCourseItem(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedIndex - 1 + queryCourses.length) % queryCourses.length;
      setHighlightedIndex(newIndex);
      focusCourseItem(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleAddCourse(queryCourses[highlightedIndex]);
    }
  }

  function focusCourseItem(index: number) {
    // Query all li elements under the dropdown container
    const items = document.querySelectorAll<HTMLLIElement>("#course-list li");
    if (items[index]) {
      items[index].focus();
    }
  }

  // Reviewer 1 search functions
  async function handleReviewer1Query(query: string) {
    setReviewer1Query(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(
      `assign-reviewers?query=${query}`,
      "POST",
      {
        excludedIds,
      }
    );
    setQueryReviewers1(data);
  }

  function handleReviewer1KeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (queryReviewers1.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedReviewer1Index + 1) % queryReviewers1.length;
      setHighlightedReviewer1Index(newIndex);
      focusReviewer1Item(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedReviewer1Index - 1 + queryReviewers1.length) %
        queryReviewers1.length;
      setHighlightedReviewer1Index(newIndex);
      focusReviewer1Item(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectReviewer1(queryReviewers1[highlightedReviewer1Index]);
    }
  }

  function focusReviewer1Item(index: number) {
    const items =
      document.querySelectorAll<HTMLLIElement>("#reviewer1-list li");
    if (items[index]) {
      items[index].focus();
    }
  }

  function handleSelectReviewer1(professor: AppUser) {
    setSelectedReviewer1(professor);
    setQueryReviewers1([]);
    setReviewer1Query("");
    setHighlightedReviewer1Index(0);
    setExcludedIds((prev) => [...prev, professor.id]);
    setBody((prev) => ({
      ...prev,
      secondReviewerId: Number(professor.id),
    }));
  }

  // Reviewer 2 search functions
  async function handleReviewer2Query(query: string) {
    setReviewer2Query(query);
    if (!query) {
      return;
    }
    const { data } = await authFetch(
      `assign-reviewers?query=${query}`,
      "POST",
      {
        excludedIds,
      }
    );

    setQueryReviewers2(data);
  }

  function handleReviewer2KeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (queryReviewers2.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedReviewer2Index + 1) % queryReviewers2.length;
      setHighlightedReviewer2Index(newIndex);
      focusReviewer2Item(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedReviewer2Index - 1 + queryReviewers2.length) %
        queryReviewers2.length;
      setHighlightedReviewer2Index(newIndex);
      focusReviewer2Item(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectReviewer2(queryReviewers2[highlightedReviewer2Index]);
    }
  }

  function focusReviewer2Item(index: number) {
    const items =
      document.querySelectorAll<HTMLLIElement>("#reviewer2-list li");
    if (items[index]) {
      items[index].focus();
    }
  }

  function handleSelectReviewer2(professor: AppUser) {
    setSelectedReviewer2(professor);
    setQueryReviewers2([]);
    setReviewer2Query("");
    setHighlightedReviewer2Index(0);
    setExcludedIds((prev) => [...prev, professor.id]);
    setBody((prev) => ({
      ...prev,
      thirdReviewerId: Number(professor.id),
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

    if (!body.secondReviewerId) {
      setPending(false)
      setErrors({...errors, secondReviewerId: "Reviewer 1 required"})
      return;
    }

    if (!body.thirdReviewerId) {
      setPending(false)
      setErrors({...errors, thirdReviewerId: "Reviewer 2 required"})
      return;
    }

    const res = await createThesis(body);
    if (res.status === 200) {
      setPending(false)
      notify("success", "Thesis created!");
      setErrors(initialErrors)
      formRef.current?.reset();
      setSelectedCourses([])
      setSelectedReviewer1(null)
      setSelectedReviewer2(null)
      document.dispatchEvent(new Event('ClearEditor'));
      return;
    }

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
            className="flex gap-3 font-medium text-gray-700"
          >
            Title
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

        <Textarea handleDescription={handleDescription} />

        <div className="space-y-1">
          <label className="flex gap-3 font-medium text-gray-700">
            Recommended Courses
          </label>
          <div className="flex flex-row pt-1">
            <button
              type="button"
              className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
              onClick={() => setShowCourseSearch(true)}
            >
              <Plus size={16} /> Add Course
            </button>
          </div>

          {showCourseSearch && (
            <div className="relative mt-2">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                placeholder="Search courses..."
                value={courseQuery}
                onChange={(e) => handleQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {queryCourses.length > 0 && (
                <ul
                  id="course-list"
                  className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto"
                  style={{ bottom: "calc(100% + 8px)" }}
                >
                  {queryCourses.map((course, index) => (
                    <li
                      key={course.id}
                      tabIndex={-1} // Makes the li focusable
                      onKeyDown={handleKeyDown}
                      onClick={() => handleAddCourse(course)}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        highlightedIndex === index ? "bg-gray-300" : ""
                      }`}
                    >
                      {course.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-1">
            {selectedCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center bg-gray-200 px-3 py-1 rounded-md"
              >
                {course.name}
                <X
                  size={16}
                  className="ml-2 cursor-pointer text-red-500"
                  onClick={() => handleRemoveCourse(course)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reviewer 1 Field */}
        <div className="space-y-1">
          <label className="flex gap-3 font-medium text-gray-700">
            Reviewer 1
            <>
            {errors.secondReviewerId ? (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <CircleAlert size={13} /> {errors.secondReviewerId}
                </span>
              ) : null}
              </>
          </label>
          {selectedReviewer1 ? (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
              {selectedReviewer1.firstName} {selectedReviewer1.lastName}
              <X
                size={16}
                className="ml-2 cursor-pointer text-red-500"
                onClick={() => {
                  setExcludedIds(
                    excludedIds.filter((id) => id !== selectedReviewer1.id)
                  );
                  setBody((prev) => ({
                    ...prev,
                    secondReviewerId: 0,
                  }));
                  setSelectedReviewer1(null);
                }}
              />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                placeholder="Search professors..."
                value={reviewer1Query}
                onChange={(e) => handleReviewer1Query(e.target.value)}
                onKeyDown={handleReviewer1KeyDown}
              />
              {queryReviewers1.length > 0 && reviewer1Query && (
                <ul
                  id="reviewer1-list"
                  className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto"
                  style={{ bottom: "calc(100% + 8px)" }}
                >
                  {queryReviewers1.map((professor, index) => (
                    <li
                      key={professor.id}
                      tabIndex={-1}
                      onKeyDown={handleReviewer1KeyDown}
                      onClick={() => handleSelectReviewer1(professor)}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        highlightedReviewer1Index === index ? "bg-gray-300" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          {professor.firstName} {professor.lastName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {professor.username}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Reviewer 2 Field */}
        <div className="space-y-1">
          <label className="flex gap-3 font-medium text-gray-700">
            Reviewer 2
            <>
            {errors.thirdReviewerId ? (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <CircleAlert size={13} /> {errors.thirdReviewerId}
                </span>
              ) : null}
            </>
          </label>
          {selectedReviewer2 ? (
            <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
              {selectedReviewer2.firstName} {selectedReviewer2.lastName}
              <X
                size={16}
                className="ml-2 cursor-pointer text-red-500"
                onClick={() => {
                  setExcludedIds(
                    excludedIds.filter((id) => id !== selectedReviewer2.id)
                  );
                  setSelectedReviewer2(null);
                  setBody((prev) => ({
                    ...prev,
                    thirdReviewerId: 0,
                  }));
                }}
              />
            </div>
          ) : (
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                placeholder="Search professors..."
                value={reviewer2Query}
                onChange={(e) => handleReviewer2Query(e.target.value)}
                onKeyDown={handleReviewer2KeyDown}
              />
              {queryReviewers2.length > 0 && reviewer2Query && (
                <ul
                  id="reviewer2-list"
                  className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto"
                  style={{ bottom: "calc(100% + 8px)" }}
                >
                  {queryReviewers2.map((professor, index) => (
                    <li
                      key={professor.id}
                      tabIndex={-1}
                      onKeyDown={handleReviewer2KeyDown}
                      onClick={() => handleSelectReviewer2(professor)}
                      className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                        highlightedReviewer2Index === index ? "bg-gray-300" : ""
                      }`}
                    >
                      <div className="flex flex-col gap-2">
                        <div>
                          {professor.firstName} {professor.lastName}
                        </div>
                        <div className="text-sm text-neutral-500">
                          {professor.username}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

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
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
