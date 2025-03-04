import { Course } from "@/types/app-types";
import { SquareArrowOutUpRight } from "lucide-react";

export default function ViewingRecommendedCourses({
  courses,
}: {
  courses: Course[];
}) {
  if (courses.length === 0) {
    return (
      <div className="space-y-1">
        <div className="flex gap-3 font-medium text-gray-700">
          Recommended Courses
        </div>
        <div>-</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-3 font-medium text-gray-700">
        Recommended Courses
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {courses.map((course) => (
          <div
            key={course.id}
            className="flex items-center bg-gray-200 px-3 py-1 rounded-md"
          >
            {course.url ? (
              <a
                href={course.url}
                target="_blank"
                className="flex items-center"
              >
                {course.name}
                <SquareArrowOutUpRight
                  size={16}
                  className="ml-2 cursor-pointer text-blue-600"
                />
              </a>
            ) : (
              <div>{course.name}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
