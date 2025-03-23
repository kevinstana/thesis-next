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

export default function MyAssignment({
  data,
}: {
  data: DetailedThesisResponse;
}) {
  const publishThesisModalRef = useRef<PublishThesisModalRef>(null);

  return (
    <div className="flex gap-4">
      <div className="hidden lg:block flex-col px-2 space-y-6 max-w-[600px] h-[87vh] overflow-y-auto overflow-x-hidden">
        <div className="flex flex-col gap-1">
          <h1 className="text-black text-wrap font-bold">Title:</h1>
          <div className="w-[500px] break-words">{data.thesis.title}</div>
        </div>

        <div className="flex flex-col">
          <h1 className="text-black font-bold">Description:</h1>
          <Textarea initDescription={data.thesis.description} pretty readonly />
        </div>

        <ViewingRecommendedCourses courses={data.recommendedCourses} />

        <div className="flex flex-col gap-1">
          <h1 className="text-black font-bold">Professor:</h1>
          <div className="w-[500px]">{`${data.thesis.professorFirstName} ${data.thesis.professorLastName}`}</div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-black font-bold">Reviewer 1:</h1>
          <div className="w-[500px]">{`${data.thesis.reviewer1FirstName} ${data.thesis.reviewer1LastName}`}</div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-black font-bold">Reviewer 2:</h1>
          <div className="w-[500px]">{`${data.thesis.reviewer2FirstName} ${data.thesis.reviewer2LastName}`}</div>
        </div>

        <div className="flex flex-col gap-1">
          <h1 className="text-black font-bold">Status:</h1>
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
