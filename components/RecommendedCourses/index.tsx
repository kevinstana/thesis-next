"use client";

import { getThesisCourses } from "@/lib/server-actions";
import { Course } from "@/types/app-types";
import { useState } from "react";
import useSWR from "swr";
import { SquareArrowOutUpRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

export default function RecommendedCourses({ thesisId }: { thesisId: string }) {
  const { data, isLoading, isValidating, mutate } = useSWR(
    () => (thesisId ? ["thesis-courses", thesisId] : null),
    () => getThesisCourses(thesisId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  const courses = data?.data as Course[];

  if (isLoading) {
    return <Skeleton className="bg-neutral-100 h-4 w-4" />;
  }

  if (courses.length === 0) {
    return (
      <div className="space-y-1">
        <label className="flex gap-3 font-medium text-gray-700">
          Recommended Courses
        </label>
        <div>-</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <label className="flex gap-3 font-medium text-gray-700">
        Recommended Courses
      </label>

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
