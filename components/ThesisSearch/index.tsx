"use client";

import { authFetch } from "@/lib/server-actions";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ThesisSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const path = usePathname()
  const searchParams = useSearchParams();
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<string[]>([]);

  async function handleQuery(query: string) {
    setQuery(query);
    if (!query) {
      return;
    }

    const { data } = await authFetch(`theses/search?query=${query}`, "GET");
    setSearchResults(data);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedIndex + 1) % searchResults.length;
      setHighlightedIndex(newIndex);
      focusItem(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedIndex - 1 + searchResults.length) % searchResults.length;
      setHighlightedIndex(newIndex);
      focusItem(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectResult(searchResults[highlightedIndex]);
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLElement>) {

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const newIndex = (highlightedIndex + 1) % searchResults.length;
      setHighlightedIndex(newIndex);
      focusItem(newIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const newIndex =
        (highlightedIndex - 1 + searchResults.length) % searchResults.length;
      setHighlightedIndex(newIndex);
      focusItem(newIndex);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSelectResult(query);
    }
  }

  function focusItem(index: number) {
    const items = document.querySelectorAll<HTMLLIElement>(`#theses-search li`);
    if (items[index]) {
      items[index].focus();
    }
  }

  function handleSelectResult(result: string) {
    setSearchResults([]);
    setQuery(result);
    setHighlightedIndex(0);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("query")
    urlSearchParams.append("query", `${result}`);

    router.push(`/theses?${urlSearchParams}`);

  }

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Search className="text-neutral-700" />
        <input
          id="search-input"
          type="text"
          value={query}
          placeholder="Seach..."
          className="h-10 px-4 border rounded-md"
          onKeyDown={handleInputKeyDown}
          onChange={(e) => handleQuery(e.target.value)}
        />
        {searchResults.length > 0 && query && (
          <ul
            id="theses-search"
            className="absolute left-0 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-auto z-[52]"
            style={{ top: "100%" }}
          >
            {searchResults.map((result, index) => (
              <li
                key={result}
                tabIndex={-1}
                onKeyDown={handleKeyDown}
                onClick={() => handleSelectResult(result)}  
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                  highlightedIndex === index ? "bg-gray-300" : ""
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div>{result}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
