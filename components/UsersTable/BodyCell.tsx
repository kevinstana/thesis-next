import { dateFormatter } from "@/lib/utils";
import { AppUser } from "@/types/app-types";
import { clsx } from "clsx";
import { ChangeEvent } from "react";

const baseStyle = "px-6 py-4 whitespace-nowrap text-sm border-r";

export default function BodyCell({
  isLast,
  header,
  cellValue,
  isEditing = false,
  handleChange,
}: Readonly<{
  isLast?: boolean;
  header: string;
  cellValue: AppUser[keyof AppUser];
  isEditing?: boolean;
  handleChange?: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}>) {
  if (header === "isEnabled") {
    return (
      <td className={baseStyle}>
        {isEditing ? (
          <>
            <select
              id="isEnabled"
              name="isEnabled"
              className="w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
              defaultValue=""
              onChange={handleChange}
            >            <option value="" disabled>
            Select an option
          </option>
              <option value="true">TRUE</option>
              <option value="false">FALSE</option>
            </select>
          </>
        ) : (
          <span
            className={`rounded-full px-2 py-1  ${
              cellValue
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {String(cellValue).toUpperCase()}
          </span>
        )}
      </td>
    );
  }

  if (header === "createdAt" || header === "lastModified") {
    const formattedDate = dateFormatter(String(cellValue));

    return <td className={baseStyle}>{formattedDate}</td>;
  }

  return (
    <td className={clsx(baseStyle, { "text-center": !cellValue })}>
      {cellValue ?? "-"}
    </td>
  );
}
