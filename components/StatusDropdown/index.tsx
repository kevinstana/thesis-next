import { useEffect, useRef, useState } from "react";
import { UpdatableTask } from "../TaskCards";
import { ChevronDown } from "lucide-react";

export default function TaskStatusDropdown({ body, handleStatusChange }: { body: UpdatableTask, handleStatusChange: (status: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const options = [{ status: "IN_PROGRESS" }, { status: "DONE" }];

  const selectedStatus = options.find((opt) => opt.status === body.status);

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
      handleStatusChange(selectedOption.status)
      setIsOpen(false);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <h4 className="font-normal text-md">Status:</h4>
      <div className="relative w-56" ref={selectRef} onKeyDown={handleKeyDown}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 rounded-lg flex items-center justify-between border border-gray-200 focus:ring-2 focus:ring-offset-2 focus:ring-neutral-700"
        >
          <span>{selectedStatus?.status ?? "Select status"}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute w-full mt-2 bg-white rounded-lg border border-gray-200 z-10">
            {options.map((option) => (
              <button
                key={option.status}
                onClick={() => {
                  handleStatusChange(option.status)
                  setIsOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                {option.status}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
