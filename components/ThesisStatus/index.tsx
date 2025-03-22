import Pencil from "@/iconography/Pencil";
import { clsx } from "clsx";
import { ChangeEvent, useState } from "react";
import CheckMark from "@/iconography/CheckMark";
import Close from "@/iconography/Close";
import { authFetch, customRevalidateTag } from "@/lib/server-actions";
import { useNotification } from "@/providers/NotificationProvider";

export default function ThesisStatus({
  thesis_status,
  thesisId,
  mutate,
}: {
  thesis_status: string;
  thesisId: string;
  mutate: () => void;
}) {
  const [editing, setEditing] = useState<boolean>(false);
  const [tmpStatus, setTmpStatus] = useState<string>(thesis_status);
  const { notify } = useNotification();

  if (
    thesis_status === "AVAILABLE" ||
    thesis_status === "PUBLISHED"
  ) {
    return (
      <div
        className={clsx(
          "font-medium text-sm/[1.5rem] rounded-full px-2 py-1 w-fit",
          {
            "bg-green-500/20 text-green-500": thesis_status === "AVAILABLE",
          },
          {
            "bg-yello-500/20 text-yellow-500": thesis_status === "PUBLISHED",
          }
        )}
      >
        {thesis_status}
      </div>
    );
  }

  function getAvailableStatuses(currentStatus: string) {
    switch (currentStatus) {
      case "IN_PROGRESS":
        return ["IN_PROGRESS", "PENDING_REVIEW"];
      case "PENDING_REVIEW":
        return ["IN_PROGRESS", "PENDING_REVIEW", "REVIEWED"];
      case "REVIEWED":
        return ["IN_PROGRESS", "PENDING_REVIEW", "REVIEWED"];
    }
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setTmpStatus(value);
  };

  async function handleSave() {
    const { data, status } = await authFetch(
      `theses/${thesisId}/status`,
      "PUT",
      { status: tmpStatus }
    );

    if (status === 200) {
      setEditing(false);
      notify("success", data.message);
      customRevalidateTag("my-theses");
      customRevalidateTag("theses");
      mutate();
    } else {
      notify("error", data.message ?? "Something went wrong");
    }
  }

  return (
    <div className="flex gap-2 items-center">
      {!editing ? (
        <div
          className={clsx(
            "font-medium text-sm/[1.5rem] rounded-full px-2 py-1 w-fit",
            {
              "bg-blue-500/20 text-blue-500": thesis_status === "IN_PROGRESS",
            },
            {
              "bg-purple-500/20 text-purple-500": thesis_status === "REVIEWED",
            },
            {
              "bg-gray-500/20 text-gray-500":
                thesis_status === "PENDING_REVIEW",
            }
          )}
        >
          {thesis_status}
        </div>
      ) : (
        <div className="items-center">
          <select
            id="thesis-status-select"
            name="status"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            onChange={handleChange}
            required
            defaultValue={tmpStatus}
          >
            <option value="" disabled>
              Select a status
            </option>
            {getAvailableStatuses(thesis_status)?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      )}
      {!editing ? (
        <button
          className="hover:bg-neutral-200 p-1 rounded-lg"
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </button>
      ) : (
        <div className="flex gap-2 items-center">
          <button
            className="hover:bg-neutral-200 p-1 rounded-lg"
            onClick={() => handleSave()}
          >
            <CheckMark />
          </button>

          <button
            className="hover:bg-neutral-200 p-1 rounded-lg"
            onClick={() => setEditing(false)}
          >
            <Close />
          </button>
        </div>
      )}
    </div>
  );
}
