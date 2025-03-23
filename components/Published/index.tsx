"use client";

import { PublishedPage } from "@/types/response-types";
import PublishedCard from "./card";
import Filters from "./filters";
import PublishedSearch from "./search";
import Pagination from "../Pagination";
import { clsx } from "clsx";

export default function PublishedList({ data }: { data: PublishedPage }) {
  return (
    <div className="border border-neutral-300 rounded-lg">
      <div className="flex items-center p-4  border-b border-b-neutral-300 justify-between">
        <Filters path="published" />
        <PublishedSearch />
      </div>
      <div
        className={clsx(
          "flex flex-wrap gap-8 pt-10 pb-4 h-[70vh] overflow-y-auto",
          data.content.length !== 0 ? "pl-8" : "pl-8"
        )}
      >
        {data.content.length === 0 ? (
          <p>No results found</p>
        ) : (
          <>
            {data.content.map((thesis) => (
              <PublishedCard key={thesis.title} thesis={thesis} />
            ))}
          </>
        )}
      </div>

      {data.content.length > 0 ? (
        <Pagination
          size={data.page.size}
          number={data.page.number}
          totalElements={data.page.totalElements}
          totalPages={data.page.totalPages}
          path="published"
        />
      ) : null}
    </div>
  );
}
