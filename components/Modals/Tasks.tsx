"use client";

import { TasksModalRef } from "@/types/app-types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import ModalHeaderWithArrow from "./ModalHeaderWithArrow";
import TaskCard from "../TaskCards";
import { TaskPage } from "@/types/response-types";
import { authFetch } from "@/lib/server-actions";
import { useNotification } from "@/providers/NotificationProvider";
import AddTask from "../TaskCards/AddTask";
import useSWR from "swr";
import { getPaginationText } from "../Pagination";

const sharedNavigationButtonStyle =
  "px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed text-sm";

const TasksModal = forwardRef<TasksModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [thesisTitle, setThesisTitle] = useState<string>("");
  const [data, setData] = useState<TaskPage>();

  const [pageNumber, setPageNumber] = useState<number>(0);

  const { notify } = useNotification();

  const { isLoading, isValidating, mutate } = useSWR(
    thesisId ? `thesis-${thesisId}-tasks` : null,
    () =>
      authFetch(
        `theses/${thesisId}/tasks?pageNumbr=${pageNumber}&pageSiz=${5}`,
        "GET",
        null
      ),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setData(res.data);
      },
    }
  );

  useImperativeHandle(ref, () => ({
    openDialog: (id, title) => {
      setOpen(true);
      mutate();
      setThesisId(id);
      setThesisTitle(title);
    },
  }));

  useEffect(() => {
    if (thesisId) {
      mutate();
    }
  }, [pageNumber, mutate, thesisId]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async function handleSave(type: "SAVE" | "CANCEL", body: any) {
    switch (type) {
      case "SAVE":
        if (!body.title) {
          notify("error", "Title required");
          return;
        }

        if (
          body.description ===
            '[{"type":"paragraph","children":[{"text":""}]}]' ||
          !body.description
        ) {
          notify("error", "Description required");
          return;
        }

        if (!body.priority) {
          notify("error", "Priority required");
          return;
        }

        const formData = new FormData();
        formData.append("title", body.title);
        formData.append("description", body.description);
        formData.append("priority", body.priority);

        body.files.forEach((file: File) => {
          formData.append("files", file);
        });

        const { data, status } = await authFetch(
          `theses/${thesisId}/tasks`,
          "POST",
          null,
          formData
        );

        if (status === 200) {
          notify("success", data.message);
          setIsAdding(false);
          mutate();
          return;
        }

        notify("error", data.message);
        return;
      case "CANCEL":
        setIsAdding(false);
        return;
      default:
        return;
    }
  }

  return (
    <BaseModal open={open} className="bg-transparent">
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <ModalHeaderWithArrow
          title={`${thesisTitle} / Tasks`}
          setOpen={setOpen}
        />

        <div
          className="flex flex-col flex-grow justify-between pt-4 overflow-auto"
          tabIndex={-1}
        >
          {isLoading || isValidating ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div className="flex flex-col px-8 py-4 gap-4">
              <button
                type="button"
                className="w-fit gap-1 flex items-center px-3 py-1 border border-gray-300 rounded-md bg-neutral-100 hover:bg-neutral-200"
                onClick={() => {
                  if (!isAdding) {
                    setIsAdding(true);
                  }
                }}
              >
                <Plus size={16} /> Add Task
              </button>
              {isAdding && <AddTask handleSave={handleSave} />}
              {data?.content.map((task) => (
                <TaskCard
                  key={task.title}
                  task={task}
                  thesisId={thesisId}
                  mutate={mutate}
                />
              ))}
            </div>
          )}
        </div>

        {/* pagination */}
        <div className="flex flex-wrap items-center justify-between p-6 rounded-b-md border-t border-t-neutral-300">
          {isLoading || isValidating || data?.content.length === 0 ? null : (
            <>
              <div className="flex text-sm">
                <span className="hidden sm:block white">Showing&nbsp;</span>
                {getPaginationText(
                  Number(data?.page.size),
                  Number(data?.page.number),
                  Number(data?.page.totalElements),
                  Number(data?.page.totalPages)
                )}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className={sharedNavigationButtonStyle}
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={Number(data?.page.number) === 0}
                >
                  <ChevronLeft size={15} />
                </button>
                <span className="text-sm">
                  Page {Number(data?.page.number) + 1} of{" "}
                  {Number(data?.page.totalPages)}
                </span>
                <button
                  className={sharedNavigationButtonStyle}
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={
                    Number(data?.page.number) ===
                    Number(data?.page.totalPages) - 1
                  }
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </>
          )}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

TasksModal.displayName = "TasksModal";

export { TasksModal };
