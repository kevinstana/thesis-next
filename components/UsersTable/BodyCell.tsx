import { AppUser } from "@/types/app-types";
import { clsx } from "clsx";

const baseStyle = "px-6 py-4 whitespace-nowrap text-sm border-r";

export default function BodyCell({
  header,
  cellValue,
}: Readonly<{
  header: string;
  cellValue: AppUser[keyof AppUser];
}>) {
  if (header === "isEnabled") {
    return (
      <td className={baseStyle}>
          <span
            className={`rounded-full px-2 py-1  ${
              cellValue
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}
          >
            {String(cellValue).toUpperCase()}
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
