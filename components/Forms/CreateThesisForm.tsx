"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/providers/NotificationProvider";
import { CircleAlert, Loader2, Plus, X } from "lucide-react";
import { Course } from "@/types/app-types";
import { authFetch } from "@/lib/server-actions";

export default function CreateThesisForm({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
  const { notify } = useNotification();
  const formRef = useRef(null);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState({ title: "" });

  const [showCourseSearch, setShowCourseSearch] = useState(false);
  const [courseQuery, setCourseQuery] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [queryCourses, setQueryCourses] = useState<Course[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const courseRefs = useRef<(HTMLLIElement | null)[]>([]);

  async function handleQuery(query: string) {
    setCourseQuery(query);
    if (!query) {
        return
    }
    
    const { data } = await authFetch(`courses?name=${query}`, "POST", {
      selectedCourses: selectedCourses.map((course) => course.name),
    });
    setQueryCourses(data);
  }

  function handleAddCourse(course: Course) {
    setSelectedCourses([...selectedCourses, course]);
    setQueryCourses([]);
    setShowCourseSearch(false);
    setCourseQuery("");
    setHighlightedIndex(0);
  }

  function handleRemoveCourse(course: Course) {
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

  function handleSubmit(e) {
    e.preventDefault();
    // Form submission logic
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
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="description"
            className="flex gap-3 font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none resize-y h-fit"
            placeholder="Enter Description"
            rows={5}
            required
          />
        </div>

        <div className="space-y-1">
          <label className="flex gap-3 font-medium text-gray-700">
            Recommended Courses
          </label>
          <div className="flex flex-wrap gap-2">
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
