import { ThesisRequest } from "@/types/response-types";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { clsx } from "clsx";
import { authFetch, customRevalidateTag } from "@/lib/server-actions";
import Textarea from "../Textarea";
import { useState } from "react";
import { useNotification } from "@/providers/NotificationProvider";

export default function ThesisRequestCard({
  request,
  mutate,
  close,
}: {
  mutate: () => void;
  request: ThesisRequest;
  close?: () => void;
}) {
  const [loadingPdf, setLoadingPdf] = useState<boolean>(false);
  const studentFullName = `${request.studentFirstName} ${request.studentLastName}`;

  const { notify } = useNotification();

  async function handleFilePreview() {
    setLoadingPdf(true);

    const { data, status } = await authFetch(
      `theses/${request.thesisId}/requests/${request.pdf}`,
      "GET",
      null,
      null
    );

    if (status === 200) {
      window.open(data.url, "_blank");
    } else {
      notify("error", "Something went wrong");
    }

    setLoadingPdf(false);
  }

  async function handleApproval() {
    const { data, status } = await authFetch(
      `theses/${request.thesisId}/assign-student`,
      "PUT",
      {
        requestId: request.id,
        studentId: request.studentId,
        thesisId: request.thesisId,
        type: "APPROVE",
      },
      null
    );

    if (status === 200) {
      notify("success", data.message);
      await customRevalidateTag("my-theses");
      mutate();
      close?.();
      return;
    }

    notify("error", "Something went wrong");
  }

  async function handleRejection() {
    const { data, status } = await authFetch(
      `theses/${request.thesisId}/assign-student`,
      "PUT",
      {
        requestId: request.id,
        studentId: request.studentId,
        thesisId: request.thesisId,
        type: "REJECT",
      },
      null
    );

    if (status === 200) {
      notify("success", data.message);
      mutate();
      return;
    }

    notify("error", "Something went wrong");
  }

  async function handleUndo() {
    const { data, status } = await authFetch(
      `theses/${request.thesisId}/assign-student`,
      "PUT",
      {
        requestId: request.id,
        studentId: request.studentId,
        thesisId: request.thesisId,
        type: "UNDO",
      },
      null
    );

    if (status === 200) {
      notify("success", data.message);
      mutate();
      return;
    }

    notify("error", data.message);
  }

  return (
    <Card className={clsx("w-full")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">{studentFullName}</h3>
            <p className="text-sm text-muted-foreground">
              {request.studentUsername}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex gap-1">
              {loadingPdf && (
                <Loader2 size={10} className="mt-1 animate-spin" />
              )}
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span
                    className="hover:text-blue-600 hover:underline hover:cursor-pointer"
                    onClick={handleFilePreview}
                  >
                    Grades.pdf
                  </span>
                </div>

                <span className="text-xs">
                  {(request.pdfSize / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea initDescription={request.description} readonly pretty />
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {request.status === "PENDING" ? (
          <>
            <Button
              variant="outline"
              onClick={handleRejection}
              className="text-destructive hover:bg-destructive/10"
            >
              Reject
            </Button>
            <Button onClick={handleApproval}>Approve</Button>{" "}
          </>
        ) : (
          <div className="flex gap-2">
            <div
              className={clsx(
                "flex items-center p-2 text-sm rounded-full px-2 py-1",
                {
                  "bg-green-500/20 text-green-500":
                    request.status === "APPROVED",
                  "bg-red-500/20 text-red-500": request.status === "REJECTED",
                  "bg-orange-500/20 text-orange-500":
                    request.status === "INVALID",
                }
              )}
            >
              {request.status}
            </div>

            {request.status !== "INVALID" && (
              <Button
                className="bg-white shadow-none text-black border hover:bg-neutral-100 border-neutral-300 rounded-md h-8"
                onClick={handleUndo}
              >
                Undo
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
