import { authFetch } from "@/lib/server-actions";
import { Course } from "@/types/app-types";
import { useRef, useState } from "react";
import { Plus, X } from "lucide-react";

export default function EditingRecommendedCourses({
  courses,
  handleCourseChange,
}: {
  courses: Course[];
  handleCourseChange: (trigger: "add" | "remove", course: Course) => void;
}) {
  const [showCourseSearch, setShowCourseSearch] = useState(false);
  const [courseQuery, setCourseQuery] = useState("");
  const [queryCourses, setQueryCourses] = useState<Course[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const addCourseButtonRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  async function handleQuery(query: string) {
    setCourseQuery(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(`courses?name=${`${query}`}`, "POST", {
      selectedCourses: courses.map((course) => course.name),
    });
    setQueryCourses(data);
  }

  function handleAddCourse(course: Course) {
    handleCourseChange("add", course);
    setQueryCourses([]);
    setShowCourseSearch(false);
    setCourseQuery("");
    setHighlightedIndex(0);

    addCourseButtonRef.current?.focus();
  }

  function handleRemoveCourse(course: Course) {
    handleCourseChange("remove", course);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (queryCourses.length === 0) return;

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
    const items = document.querySelectorAll<HTMLLIElement>("#course-list li");
    if (items[index]) {
      items[index].focus();
    }
  }

  return (
    <div className="space-y-1">
      <label className="flex gap-3 font-medium text-gray-700">
        Recommended Courses
      </label>
      <div className="flex flex-row pt-1">
        <button
          ref={addCourseButtonRef}
          type="button"
          className="flex items-center px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-100"
          onClick={() => {
            setShowCourseSearch(!showCourseSearch);
            setTimeout(() => searchInputRef.current?.focus(), 0);
          }}
        >
          <Plus size={16} /> Add Course
        </button>
      </div>

      {showCourseSearch && (
        <div className="relative mt-2">
          <input
            ref={searchInputRef}
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
                  key={course.id + course.name}
                  tabIndex={-1}
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
        {courses.map((course) => (
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
  );
}
