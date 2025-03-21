import { authFetch, customRevalidateTag } from "@/lib/server-actions";
import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useNotification } from "@/providers/NotificationProvider";

type Student = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

export default function AssignStudent({
  thesisId,
  handleOpen,
}: {
  thesisId: string;
  handleOpen: () => void;
}) {
  const [studentQuery, setStudentQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>();
  const [searchResults, setSearchResults] = useState<Student[]>([]);
  const [highlightedStudentIndex, setHighlightedStudentIndex] = useState(0);
  const { notify } = useNotification();

  async function handleStudentQuery(query: string) {
    setStudentQuery(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(
      `search-students?query=${`${encodeURIComponent(query)}`}`,
      "GET"
    );
    setSearchResults(data);
  }

  function handleStudentKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedStudentIndex + 1) % searchResults.length;
      setHighlightedStudentIndex(newIndex);
      focusStudentItem(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedStudentIndex - 1 + searchResults.length) %
        searchResults.length;
      setHighlightedStudentIndex(newIndex);
      focusStudentItem(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectStudent(searchResults[highlightedStudentIndex]);
    }
  }

  function focusStudentItem(index: number) {
    const items =
      document.querySelectorAll<HTMLLIElement>(`#assign-student li`);
    if (items[index]) {
      items[index].focus();
    }
  }

  function handleSelectStudent(student: Student) {
    setSelectedStudent({
      id: student.id,
      firstName: student.firstName,
      lastName: student.lastName,
      username: student.username,
    });
    setSearchResults([]);
    setStudentQuery("");
    setHighlightedStudentIndex(0);
  }

  async function handleApproval() {
    const { data, status } = await authFetch(
      `theses/${thesisId}/assign-student`,
      "PUT",
      {
        requestId: 0,
        studentId: selectedStudent?.id,
        thesisId: thesisId,
        type: "APPROVE",
      },
      null
    );

    if (status === 200) {
      notify("success", "Student assigned");
      await customRevalidateTag("my-theses");
      handleOpen();
      return;
    }

    notify("error", data.message);
  }

  return (
    <div className="space-y-1">
      <label className="flex gap-1 font-medium text-gray-700">
        Assign Student
      </label>
      {selectedStudent ? (
        <div className="flex gap-4">
          <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
            {selectedStudent.firstName} {selectedStudent.lastName}
            <X
              size={16}
              className="ml-2 cursor-pointer text-red-500"
              onClick={() => {
                setSelectedStudent(null);
              }}
            />
          </div>

          <Button type="button" className="w-fit" onClick={handleApproval}>
            Assign
          </Button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Search students..."
            value={studentQuery}
            name="committee-member"
            onChange={(e) => handleStudentQuery(e.target.value)}
            onKeyDown={handleStudentKeyDown}
          />
          {searchResults.length > 0 && studentQuery && (
            <ul
              id="assign-student"
              className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto z-[53]"
              style={{ top: "calc(100% + 8px)" }}
            >
              {searchResults.map((student, index) => (
                <li
                  key={student.id}
                  tabIndex={-1}
                  onKeyDown={handleStudentKeyDown}
                  onClick={() => handleSelectStudent(student)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    highlightedStudentIndex === index ? "bg-gray-300" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      {student.firstName} {student.lastName}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {student.username}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
