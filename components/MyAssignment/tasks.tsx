import { authFetch } from "@/lib/server-actions";
import { TaskPage } from "@/types/response-types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import TaskCard from "../TaskCards";
import { getPaginationText } from "../Pagination";

const sharedNavigationButtonStyle =
  "px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed text-sm";

export default function MyAssignmentTasks({ thesisId }: { thesisId: string }) {
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [data, setData] = useState<TaskPage>();

  const { isLoading, isValidating, mutate } = useSWR(
    thesisId ? `my-assignment-tasks` : null,
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

  useEffect(() => {
    if (thesisId) {
      mutate();
    }
  }, [pageNumber, mutate, thesisId]);

  return (
    <div className="flex flex-col border w-full h-[87vh] rounded-md overflow-hidden">
      <h1 className="sticky top-0 left-0 z-50 pl-4 p-2 bg-white border-b text-black font-bold">
        Tasks
      </h1>

      <div
        className="flex flex-col flex-grow justify-between pt-4 h-full w-full overflow-auto"
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
          <div className="flex flex-col px-8 py-4 gap-4 overflow-auto">
            {Number(data?.content.length) > 0 ? (
              data?.content.map((task) => (
                <TaskCard
                  key={task.title}
                  task={task}
                  thesisId={thesisId}
                  mutate={mutate}
                />
              ))
            ) : (
              <div>No tasks found</div>
            )}
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
    </div>
  );
}
