import { formatFromCamelCase } from "@/lib/utils";

export default function HeaderCell({ header }: Readonly<{ header: string }>) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap">
      {formatFromCamelCase(header)}
    </th>
  );
}
