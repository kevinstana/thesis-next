import { formatFromCamelCase } from "@/lib/utils";

export default function HeaderCell({ header }: Readonly<{ header: string }>) {

  return (
    <th className="sticky top-0 px-6 py-3 text-left text-xs font-medium uppercase tracking-wider whitespace-nowrap border-r bg-neutral-100">
      {header === "professorFullName" ? "PROFESSOR" : formatFromCamelCase(header)}
    </th>
  );
}
