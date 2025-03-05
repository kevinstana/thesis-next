import { authFetch } from "@/lib/server-actions";
import { AppUser, CommitteeMember } from "@/types/app-types";
import { CircleAlert, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CommitteMember({
  elementId,
  label,
  excludedIds,
  handleCommitteeChange,
  errors,
  clear,
  initMember,
}: {
  elementId: string;
  label: string;
  excludedIds: number[];
  handleCommitteeChange: (
    trigger: "add" | "remove",
    id: number,
    memberLabel: string
  ) => void;
  errors?: { title: string; secondReviewerId: string; thirdReviewerId: string };
  clear: boolean;
  initMember: CommitteeMember | null;
}) {
  useEffect(() => {
    setSelectedMember(initMember);
    if (clear) {
      setSelectedMember(null);
    }
  }, [clear, initMember]);

  const [memberQuery, setMemberQuery] = useState("");
  const [selectedMember, setSelectedMember] =
    useState<CommitteeMember | null>();
  const [searchResults, setSearchResults] = useState<AppUser[]>([]);
  const [highlightedMemberIndex, setHighlightedMemberIndex] = useState(0);

  async function handleMemberQuery(query: string) {
    setMemberQuery(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(
      `assign-reviewers?query=${query}`,
      "POST",
      {
        excludedIds,
      }
    );
    setSearchResults(data);
  }

  function handleMemberKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedMemberIndex + 1) % searchResults.length;
      setHighlightedMemberIndex(newIndex);
      focusMemberItem(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedMemberIndex - 1 + searchResults.length) %
        searchResults.length;
      setHighlightedMemberIndex(newIndex);
      focusMemberItem(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectMember(searchResults[highlightedMemberIndex]);
    }
  }

  function focusMemberItem(index: number) {
    const items = document.querySelectorAll<HTMLLIElement>(`#${elementId} li`);
    if (items[index]) {
      items[index].focus();
    }
  }

  function handleSelectMember(professor: AppUser) {
    setSelectedMember({
      id: professor.id,
      firstName: professor.firstName,
      lastName: professor.lastName,
      username: professor.username,
    });
    setSearchResults([]);
    setMemberQuery("");
    setHighlightedMemberIndex(0);
    handleCommitteeChange("add", professor.id, label);
  }

  return (
    <div className="space-y-1">
      <label className="flex gap-1 font-medium text-gray-700">
        {label}
        <span className="text-red-300">*</span>
        <>
          {errors?.secondReviewerId ? (
            <span className="flex items-center gap-1 text-sm text-red-500">
              <CircleAlert size={13} /> {errors.secondReviewerId}
            </span>
          ) : null}
        </>
      </label>
      {selectedMember ? (
        <div className="flex items-center bg-gray-200 px-3 py-1 rounded-md w-fit">
          {selectedMember.firstName} {selectedMember.lastName}
          <X
            size={16}
            className="ml-2 cursor-pointer text-red-500"
            onClick={() => {
              handleCommitteeChange("remove", selectedMember.id, label);
              setSelectedMember(null);
            }}
          />
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Search professors..."
            value={memberQuery}
            onChange={(e) => handleMemberQuery(e.target.value)}
            onKeyDown={handleMemberKeyDown}
          />
          {searchResults.length > 0 && memberQuery && (
            <ul
              id={elementId}
              className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto"
              style={{ bottom: "calc(100% + 8px)" }}
            >
              {searchResults.map((professor, index) => (
                <li
                  key={professor.id}
                  tabIndex={-1}
                  onKeyDown={handleMemberKeyDown}
                  onClick={() => handleSelectMember(professor)}
                  className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                    highlightedMemberIndex === index ? "bg-gray-300" : ""
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      {professor.firstName} {professor.lastName}
                    </div>
                    <div className="text-sm text-neutral-500">
                      {professor.username}
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
