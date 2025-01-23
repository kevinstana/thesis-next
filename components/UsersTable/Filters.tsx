"use client";

import { Button } from "@/components/ui/button";
import { Role, availableRoles } from "@/types/app-types";
import { Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { clsx } from "clsx";

const pageSizes: number[] = [5, 10, 15, 20];

export default function Filters({ path }: Readonly<{ path: string }>) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [roles, setRoles] = useState<Role[]>([]);
  const [enabled, setEnabled] = useState<boolean | null>(null);

  const handleRoleSelection = useCallback(
    (role: Role) => {
      if (roles.includes(role)) {
        setRoles(roles.filter((r) => r !== role));
      } else {
        setRoles((prev) => [...prev, role]);
      }
    },
    [roles]
  );

  const handleApplyFilters = useCallback(() => {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("size", `${pageSize}`);
    if (roles.length > 0) {
      urlSearchParams.append("roles", `${roles}`);
    }

    if (enabled !== null) {
      urlSearchParams.append("enabled", `${enabled}`);
    }

    router.push(`/${path}?${urlSearchParams}`);
    setOpen(false);
  }, [pageSize, roles, enabled, router, path]);

  const handleClearAll = useCallback(() => {
    setPageSize(10);
    setRoles([]);
    setEnabled(null);
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
        <div className="flex flex-col absolute mt-2 text-nowrap bg-white shadow-md rounded-md border border-gray-200 gap-8 p-6 z-[90]">
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
              <div className="font-medium">Roles</div>
              {availableRoles.map((roleOption) => (
                <label key={roleOption} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={roleOption}
                    checked={roles.includes(roleOption)}
                    onChange={() => handleRoleSelection(roleOption)}
                  />
                  <span>{roleOption}</span>
                </label>
              ))}
            </div>

            {/* Enabled */}
            <div className="flex flex-col space-y-3">
              <div className="font-medium">Enabled</div>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="enabled"
                  value="true"
                  checked={enabled === true}
                  onChange={() => setEnabled(true)}
                />
                <span>TRUE</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="enabled"
                  value="false"
                  checked={enabled === false}
                  onChange={() => setEnabled(false)}
                />
                <span>FALSE</span>
              </label>
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
