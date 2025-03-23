"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function PublishedSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelectResult(query);
    }
  }

  function handleSelectResult(result: string) {
    setQuery(result);

    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.delete("query");
    urlSearchParams.append("query", `${encodeURIComponent(result)}`);

    router.push(`/published?${urlSearchParams}`);
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
          // onChange={(e) => handleQuery(e.target.value)}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
