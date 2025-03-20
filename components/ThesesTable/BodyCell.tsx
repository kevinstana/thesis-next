import { BasicThesis } from "@/types/app-types";
import { clsx } from "clsx";

const baseStyle = "px-6 py-4 whitespace-nowrap text-sm border-r";

export default function BodyCell({
  header,
  cellValue,
}: Readonly<{
  header: string;
  cellValue: BasicThesis[keyof BasicThesis];
}>) {
  if (header === "status") {
    return (
      <td className={baseStyle}>
        <span
          className={clsx(
            "rounded-full px-2 py-1",
            { "bg-green-500/20 text-green-500": cellValue === "AVAILABLE" },
            { "bg-blue-500/20 text-blue-500": cellValue === "IN_PROGRESS" },
            {
              "bg-gray-500/20 text-gray-500":
                cellValue === "PENDING_REVIEW",
            },
            { "bg-purple-500/20 text-purple-500": cellValue === "REVIEWED" },
            { "bg-yellow-500/20 text-yellow-500": cellValue === "PUBLISHED" }
          )}
        >
          {cellValue}
        </span>
      </td>
    );
  }

  return (
    <td className={clsx(baseStyle, { "text-center": !cellValue })}>
      {cellValue ?? "-"}
    </td>
  );
}
