"use client";

import { ThesisRequestsModalRef } from "@/types/app-types";
import { forwardRef, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import BaseModalHeader from "./BaseModalHeader";
import useSWR from "swr";
import { authFetch } from "@/lib/server-actions";
import { ThesisRequestsPage } from "@/types/response-types";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import ThesisRequestCard from "../ThesisRequestsCard";
import { getPaginationText } from "../Pagination";
import AssignStudent from "../AssignStudent";

const sharedNavigationButtonStyle =
  "px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed text-sm";

const ThesisRequestsModal = forwardRef<ThesisRequestsModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");
  const [thesisTitle, setThesisTitle] = useState<string>("");

  const [pageNumber, setPageNumber] = useState<number>(0);
  const pageSize = 5;

  const [data, setData] = useState<ThesisRequestsPage>();

  const { isLoading, isValidating, mutate } = useSWR(
    thesisId ? `thesis-${thesisId}-requests-${pageNumber}` : null,
    () =>
      authFetch(
        `theses/${thesisId}/requests`,
        "POST",
        { pageNumber, pageSize },
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
      setThesisId(id);
      setPageNumber(0);
      setThesisTitle(title);
      mutate();
    },
  }));

  const handleOpen = () => {
    setOpen(false);
    setTimeout(() => (document.body.style.pointerEvents = ""), 10);
  };

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader
          title={`${thesisTitle} / Requests`}
          setOpen={setOpen}
          cleanUp={() => {
            setPageNumber(0);
            setThesisId("");
          }}
        />

        <div
          className="flex flex-col flex-grow justify-between px-4 pt-4 overflow-auto py-4 gap-4"
          tabIndex={-1}
        >
          {/* form */}
          {isLoading || isValidating ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div className="flex flex-col px-4 gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <AssignStudent thesisId={thesisId} handleOpen={handleOpen} />
                </div>
                {data?.content
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .map((request) => (
                    <ThesisRequestCard
                      key={request.id}
                      request={request}
                      mutate={mutate}
                      close={() => setOpen(false)}
                    />
                  ))}
              </div>
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

ThesisRequestsModal.displayName = "ThesisRequestsModal";

export { ThesisRequestsModal };
