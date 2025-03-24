"use client";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";
import { availableStatuses } from "@/types/app-types";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default function GenericFilters({ path }: Readonly<{ path: string }>) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<string>("15");
  const [statuses, setStatuses] = useState<string[]>([]);

  const handleStatusSelection = useCallback(
    (status: string) => {
      if (statuses.includes(status)) {
        setStatuses(statuses.filter((s) => s !== status));
      } else {
        setStatuses((prev) => [...prev, status]);
      }
    },
    [statuses]
  );

  const handleApplyFilters = useCallback(() => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("size", `${pageSize}`);

    if (statuses.length > 0) {
      urlSearchParams.append("status", `${statuses}`);
    }

    router.push(`/${path}?${urlSearchParams}`);
    setOpen(false);
  }, [pageSize, statuses, router, path]);

  const handleClearAll = useCallback(() => {
    setPageSize("15");
    setStatuses([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        className={clsx(
          "flex items-center justify-center border gap-2 p-2 rounded-lg hover:bg-neutral-100",
          { "bg-neutral-200/60": open }
        )}
        onClick={() => setOpen(!open)}
      >
        <Filter size={20} />
        Filters
      </button>

      {open ? (
        <div
          ref={filterMenuRef}
          className="flex flex-col absolute mt-2 text-nowrap bg-white shadow-md rounded-md border border-gray-200 gap-8 p-6 z-[90]"
        >
          {/* Page, Role, and Enabled container */}
          <div className="flex flex-col sm:flex-row gap-14 sm:gap-8">
            {/* Page Size */}
            <div className="flex flex-col space-y-3">
              <div className="font-medium">Page Size</div>
              {pageSizes.map((size) => (
                <label key={size} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="pageSize"
                    value={size}
                    checked={pageSize === size}
                    onChange={() => setPageSize(size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>

            {/* Roles */}
            <div className="flex flex-col space-y-3">
              <div className="font-medium">Status</div>
              {availableStatuses.map((statusOption) => (
                <label
                  key={statusOption}
                  className="flex items-center space-x-2"
                >
                  <input
                    type="checkbox"
                    value={statusOption}
                    checked={statuses.includes(statusOption)}
                    onChange={() => handleStatusSelection(statusOption)}
                  />
                  <span>{statusOption}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <Button onClick={() => handleApplyFilters()}>Apply</Button>
            <Button onClick={() => handleClearAll()}>Clear All</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
