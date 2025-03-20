"use client";

import { DetailedThesisResponse } from "@/types/app-types";
import Textarea from "../Textarea";
import ViewingRecommendedCourses from "../RecommendedCourses/Viewing";
import { clsx } from "clsx";
import MyAssignmentTasks from "./tasks";
import { Button } from "../ui/button";

export default function MyAssignment({
  data,
}: {
  data: DetailedThesisResponse;
}) {
  return (
    <div className="flex gap-4">
      <div className="hidden lg:block flex-col space-y-6 max-w-[600px] h-[87vh] overflow-y-auto overflow-x-hidden">
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
            className={clsx("rounded-full px-2 py-1 w-fit", {
              "bg-blue-500/20 text-blue-500":
                data.thesis.status === "IN_PROGRESS",
            })}
          >
            {data.thesis.status.replace("_", " ")}
          </div>
        </div>

        {data.thesis.status === "REVIEWED" ? (
          <div className="flex flex-col gap-1">
            <Button className="w-fit">Publish</Button>
          </div>
        ) : null}
      </div>

      <MyAssignmentTasks thesisId={data.thesis.id} />
    </div>
  );
}
