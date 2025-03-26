"use client";

import {
  DetailedThesisResponse,
  PublishThesisModalRef,
} from "@/types/app-types";
import Textarea from "../Textarea";
import ViewingRecommendedCourses from "../RecommendedCourses/Viewing";
import { clsx } from "clsx";
import MyAssignmentTasks from "./tasks";
import { Button } from "../ui/button";
import { useRef } from "react";
import { PublishThesisModal } from "../Modals/PublishThesisModal";
import { Award, NotebookPen, Users } from "lucide-react";
import { getFinalGrade } from "../Published/card";

export default function MyAssignment({
  data,
}: {
  data: DetailedThesisResponse;
}) {
  const publishThesisModalRef = useRef<PublishThesisModalRef>(null);

  const showGrades =
    data.thesis.status === "REVIEWED" || data.thesis.status === "PUBLISHED";

  return (
    <div className="flex gap-4">
      <div className="hidden lg:block flex-col px-2 space-y-6 max-w-[600px] h-[87vh] overflow-y-auto overflow-x-hidden pb-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-black text-wrap font-bold">Title:</h2>
          <p className="max-w-[440px] break-words">{data.thesis.title}</p>
        </div>

        <div className="flex flex-col">
          <h2 className="text-black font-bold">Description:</h2>
          <Textarea initDescription={data.thesis.description} pretty readonly />
        </div>

        <ViewingRecommendedCourses courses={data.recommendedCourses} />

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex flex-row gap-1 items-center">
              <Users className="h-4 w-4 shrink-0" />
              <span className="underline font-bold">Committee</span>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2 mt-1 font-semibold">
                <span>Professor:</span>
                <span>Reviewer 1:</span>
                <span>Reviewer 2:</span>
              </div>

              <div className="flex flex-col gap-2 mt-1">
                <div>
                  <span>
                    {data.thesis.professorFirstName}{" "}
                    {data.thesis.professorLastName}
                  </span>
                </div>
                <div>
                  <span>
                    {data.thesis.reviewer1FirstName}{" "}
                    {data.thesis.reviewer1LastName}
                  </span>
                </div>
                <div>
                  <span>
                    {data.thesis.reviewer2FirstName}{" "}
                    {data.thesis.reviewer2LastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {showGrades ? (
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex flex-row gap-1 items-center">
                  <NotebookPen className="h-4 w-4 shrink-0" />
                  <span className="underline font-bold">Grades</span>
                </div>
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-2 mt-1 font-semibold">
                    <span>Professor:</span>
                    <span>Reviewer 1:</span>
                    <span>Reviewer 2:</span>
                  </div>

                  <div className="flex flex-col gap-2 mt-1">
                    <div>
                      <span>{data.thesis.professorGrade}</span>
                    </div>
                    <div>
                      <span>{data.thesis.reviewer1Grade}</span>
                    </div>
                    <div>
                      <span>{data.thesis.reviewer2Grade}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-row gap-1 items-center">
                  <Award className="h-4 w-4 shrink-0" />
                  <span className="underline font-bold">Final Grade</span>
                </div>
                <div className="flex flex-col gap-2 mt-1">
                  <div>
                    <span className="font-semibold">
                      {getFinalGrade(
                        data.thesis.professorGrade,
                        data.thesis.reviewer1Grade,
                        data.thesis.reviewer2Grade
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="text-black font-bold">Status:</h2>
          <div
            className={clsx(
              "rounded-full px-2 py-1 w-fit",
              {
                "bg-green-500/20 text-green-500":
                  data.thesis.status === "AVAILABLE",
              },
              {
                "bg-blue-500/20 text-blue-500":
                  data.thesis.status === "IN_PROGRESS",
              },
              {
                "bg-gray-500/20 text-gray-500":
                  data.thesis.status === "PENDING_REVIEW",
              },
              {
                "bg-purple-500/20 text-purple-500":
                  data.thesis.status === "REVIEWED",
              },
              {
                "bg-yellow-500/20 text-yellow-500":
                  data.thesis.status === "PUBLISHED",
              }
            )}
          >
            {data.thesis.status.replace("_", " ")}
          </div>
        </div>

        {data.thesis.status === "REVIEWED" ? (
          <div className="flex flex-col gap-1">
            <Button
              className="w-fit"
              onClick={() =>
                publishThesisModalRef.current?.openDialog(
                  data.thesis.id,
                  data.thesis.title
                )
              }
            >
              Publish
            </Button>
          </div>
        ) : null}
      </div>

      <PublishThesisModal ref={publishThesisModalRef} />

      <MyAssignmentTasks thesisId={data.thesis.id} />
    </div>
  );
}
