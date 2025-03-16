import { clsx } from "clsx";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Textarea from "../Textarea";
import { DetailedTask, TaskFile } from "@/types/response-types";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, Paperclip, SquareArrowOutUpRight, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Required from "../Required";
import { useNotification } from "@/providers/NotificationProvider";
import CustomActions from "../Popovers";
import { authFetch } from "@/lib/server-actions";
import TaskStatusDropdown from "../StatusDropdown";

const MAX_SIZE_MB = 50 * 1024 * 1024;

const options = [
  {
    priority: "LOW",
    class: "rounded-t-lg text-green-500",
    selectedClass: "text-green-500",
  },
  {
    priority: "MEDIUM",
    class: "text-blue-500",
    selectedClass: "text-blue-500",
  },
  {
    priority: "HIGH",
    class: "rounded-b-lg text-red-500",
    selectedClass: "text-red-500",
  },
];

export type UpdatableTask = DetailedTask & { newFiles: File[] };

export default function TaskCard({
  task,
  thesisId,
  mutate,
}: {
  task: DetailedTask;
  thesisId: string;
  mutate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [reset, setReset] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState<UpdatableTask>({ ...task, newFiles: [] });
  const [files, setFiles] = useState<File[] | null>(null);
  const { notify } = useNotification();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.priority === body.priority);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setBody((prev) => ({ ...prev, [name]: value }));
  }

  const handleDescription = useCallback((description: string) => {
    setBody((prev) => ({ ...prev, description }));
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null ? 0 : Math.min(options.length - 1, prevIndex + 1)
      );
    }

    if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex === null ? options.length - 1 : Math.max(0, prevIndex - 1)
      );
    }

    if (e.key === "Enter" && highlightedIndex !== null) {
      const selectedOption = options[highlightedIndex];
      setBody((prev) => ({ ...prev, priority: selectedOption.priority }));
      setIsOpen(false);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const isDuplicate = files?.some(
        (f) => f.name === file.name && f.size === file.size
      );
      if (isDuplicate) {
        notify("error", "This file has already been added.");
        return;
      }

      const currentSize = files?.reduce((acc, f) => acc + f.size, 0) || 0;
      const newSize = currentSize + file.size;

      if (newSize > MAX_SIZE_MB) {
        notify("error", "Total size cannot exceed 50MB.");
        return;
      }

      setBody((prev) => ({ ...prev, newFiles: [...prev.newFiles, file] }));
      setFiles((prevFiles) => (prevFiles ? [...prevFiles, file] : [file]));
    },
    [files, notify]
  );

  const handlePreview = (index: number) => {
    if (files?.[index]) {
      const url = URL.createObjectURL(files?.[index]);
      window.open(url, "_blank");
    } else {
      notify("error", "No file chosen");
    }
  };

  const handleDelete = async () => {
    const { status } = await authFetch(
      `theses/${thesisId}/tasks/${task.id}`,
      "DELETE"
    );

    if (status === 200) {
      mutate();
      notify("success", "Task deleted");
      return;
    }

    notify("error", "Couldn't delete task");
  };

  const handleExistingPreview = async (filename: string) => {
    const { data, status } = await authFetch(
      `theses/${thesisId}/tasks/${task.id}/${filename}`,
      "GET",
      null,
      null
    );

    if (status === 200) {
      window.open(data.url, "_blank");
    } else {
      notify("error", "Something went wrong");
    }
  };

  const handleRemoveExistingFile = (filename: string) => {
    setBody((prev) => ({
      ...prev,
      files: [...prev.files.filter((f) => f.fileName !== filename)],
    }));
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", body.title);
    formData.append("description", body.description);
    formData.append("priority", body.priority);
    formData.append("status", body.status);

    body.files.forEach((file: TaskFile) => {
      formData.append("files", file.fileName);
    });

    body.newFiles.forEach((newFile: File) => {
      formData.append("newFiles", newFile);
    });

    const { status } = await authFetch(
      `theses/${thesisId}/tasks/${task.id}`,
      "PUT",
      null,
      formData
    );

    if (status === 200) {
      notify("success", "Task updated");
      mutate();
    }
  };

  const handleStatusChange = (status: string) => {
    setBody((prev) => ({ ...prev, status: status }));
  };

  const handleRemoveNewFile = (fileName: string) => {
    setBody((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((file) => file.name !== fileName),
    }));

    setFiles(
      (prevFiles) => prevFiles?.filter((file) => file.name !== fileName) || []
    );
  };

  return (
    <Card className={clsx("w-full")}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <label htmlFor="title">
              Title:
              <Required />
            </label>
            <Input
              id="title"
              name="title"
              className="font-semibold text-base"
              value={body.title}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 items-center">
            <h4 className="font-normal text-md">
              Priority:
              <Required />
            </h4>
            <div
              className="relative w-56 mx-auto"
              ref={selectRef}
              onKeyDown={handleKeyDown}
            >
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={
                  "w-full px-4 py-2.5 rounded-lg flex items-center justify-between transition-all duration-200 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                }
              >
                <span
                  className={
                    !selectedOption
                      ? "text-gray-500"
                      : selectedOption.selectedClass
                  }
                >
                  {selectedOption?.priority ?? "Select priority"}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isOpen && "transform rotate-180"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="absolute w-full mt-2 bg-white rounded-lg border border-gray-200 z-10">
                  {options.map((option, index) => (
                    <button
                      key={option.priority}
                      onClick={() => {
                        setBody((prev) => ({
                          ...prev,
                          priority: option.priority,
                        }));
                        setIsOpen(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-2 text-left transition-colors duration-200 hover:opacity-90",
                        option.class,
                        highlightedIndex === index && "bg-gray-100"
                      )}
                    >
                      {option.priority}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex gap-[2px] font-medium text-gray-700">
              Description
            </div>
            <Textarea
              key={reset + ""}
              initDescription={body.description}
              handleDescription={handleDescription}
            />
          </div>

          <div className="flex justify-between gap-10">
            <div className="flex flex-col space-y-1 pl-2">
              <div className="flex flex-row">
                <label htmlFor="gradesFile" className="flex gap-[2px]">
                  <div className="flex items-center gap-[0.375rem]">
                    Attach Files
                    <Paperclip size={17} strokeWidth={1} />
                  </div>
                </label>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    id="file-input"
                    type="file"
                    accept=".png, .jpeg, .jpg, .pdf, .doc, .docx, .xlsx"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <label
                      tabIndex={0}
                      htmlFor="file-input"
                      className="custom-file-button bg-white text-black border border-neutral-400 h-8 items-center flex px-4 rounded cursor-pointer hover:bg-neutral-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          document.getElementById("file-input")?.click();
                        }
                      }}
                    >
                      Choose a file
                    </label>
                  </div>
                </div>
              </div>

              {/* file list */}
              <div className="flex flex-wrap max-w-[700px] gap-1 pt-1">
                {/* existing file list */}
                {body.files?.map((file) => (
                  <div key={file.fileName}>
                    <div className="flex border p-1 items-center">
                      <div className="flex flex-col items-center w-36">
                        <span className="text-sm font-medium text-gray-600 max-w-32 truncate">
                          {file.fileName}
                        </span>
                        <p className="text-xs text-gray-500 max-w-32 truncate">
                          {(file.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <SquareArrowOutUpRight
                          size={16}
                          className="ml-2 cursor-pointer text-blue-600"
                          onClick={() => handleExistingPreview(file.fileName)}
                        />
                        <X
                          size={16}
                          className="ml-2 cursor-pointer text-red-500"
                          onClick={() =>
                            handleRemoveExistingFile(file.fileName)
                          }
                        />{" "}
                      </div>
                    </div>
                  </div>
                ))}

                {/* new file list */}
                {files?.map((file, index) => (
                  <div key={file.name}>
                    <div className="flex border p-1 items-center">
                      <div className="flex flex-col items-center w-36">
                        <span className="text-sm font-medium text-gray-600 max-w-32 truncate">
                          {file.name}
                        </span>
                        <p className="text-xs text-gray-500 max-w-32 truncate">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <SquareArrowOutUpRight
                          size={16}
                          className="ml-2 cursor-pointer text-blue-600"
                          onClick={() => handlePreview(index)}
                        />
                        <X
                          size={16}
                          className="ml-2 cursor-pointer text-red-500"
                          onClick={() => handleRemoveNewFile(file.name)}
                        />{" "}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <TaskStatusDropdown
              body={body}
              handleStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <div className="flex gap-2">
          <Button onClick={() => handleUpdate()}>Save</Button>
          <Button
            className="bg-transparent shadow-none text-black border border-neutral-300 hover:bg-neutral-100"
            onClick={() => {
              if (window.confirm("Are you sure you want to cancel?")) {
                setBody({ ...task, newFiles: [] });
                setFiles([]);
                setReset(true);
                setTimeout(() => {
                  setReset(false);
                }, 0);
              }
            }}
          >
            Cancel
          </Button>
          <CustomActions
            actions={[
              {
                name: "Delete",
                action: () => {
                  if (window.confirm("Delete task?")) {
                    handleDelete();
                  }
                },
              },
            ]}
          />
        </div>
      </CardFooter>
    </Card>
  );
}
