import { AppUser } from "@/types/app-types";

export default function BodyCell({
  header,
  cellValue,
  isEditing,
}: Readonly<{
  header: string;
  cellValue: AppUser[keyof AppUser];
  isEditing: boolean;
}>) {
  if (header === "isEnabled") {
    return (
      <td className="px-6 py-4 whitespace-nowrap text-sm">
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

  if (header === "createdAt") {
    const createdAt = new Date(String(cellValue));

    const formatter = new Intl.DateTimeFormat("el-GR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });

    const formattedCreatedAt = formatter.format(createdAt);

    return (
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formattedCreatedAt}
      </td>
    );
  }

  return <td className="px-6 py-4 whitespace-nowrap text-sm">{cellValue}</td>;
}
