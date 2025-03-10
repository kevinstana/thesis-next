import { clsx } from "clsx";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Textarea from "../Textarea";
import { Task } from "@/types/response-types";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Required from "../Required";

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

export default function TaskCard({
  task,
  mode,
  handleSave,
}: {
  task: Task;
  mode: "ADDING" | "VIEWING";
  handleSave?: (type: "SAVE" | "CANCEL", body: Task) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const [body, setBody] = useState<Task>(task);

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

  function handleTitleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    setBody((prev) => ({ ...prev, [name]: value }));
  }

  const handleDescription = useCallback((description: string) => {
    setBody((prev) => ({ ...prev, description }));
  }, []);
  
  // console.log(body);

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
              onChange={handleTitleChange}
            />
          </div>

          <div className="flex gap-2 items-center">
            <h4 className="font-normal text-md">
              Priority:
              <Required />
            </h4>
            <div className="relative w-56 mx-auto" ref={selectRef}>
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
                  {options.map((option) => (
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
                        option.class
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
        <div className="flex flex-col gap-1">
          <div className="flex gap-[2px] font-medium text-gray-700">
            Description
          </div>
          <Textarea handleDescription={handleDescription} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {mode === "ADDING" ? (
          <div className="flex gap-2">
            <Button onClick={() => handleSave?.("SAVE", body)}>Save</Button>
            <Button
              className="bg-transparent shadow-none text-black border border-neutral-300 hover:bg-neutral-100"
              onClick={() => {
                if (window.confirm("Are you sure you want to cancel?")) {
                  handleSave?.("CANCEL", body);
                }
              }}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div>Task status</div>
        )}
      </CardFooter>
    </Card>
  );
}
