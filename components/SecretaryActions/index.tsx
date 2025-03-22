"use client";

import Dates from "./Dates";

export default function SecretaryActions() {
  return (
    <div className="flex flex-col gap-4">
      <Dates title="Assignment Dates" endpoint="assignment-dates" />
      <Dates title="Reviewing Dates" endpoint="reviewing-dates" />
    </div>
  );
}
