"use client"

import { PublishedPage } from "@/types/response-types";
import PublishedCard from "./card";

export default function PublishedList({data}: {data: PublishedPage}) {

    if (data.content.length === 0) {
        return (
            <div>No results found</div>
        )
    }

  return (
    <div>
      {data.content.map((thesis) => (
        <PublishedCard key={thesis.title} thesis={thesis} />
      ))}
    </div>
  );
}
