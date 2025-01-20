import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const validParams = ["size", "roles", "enabled"];
const sharedButtonStyle =
  "px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed text-sm";

export default function Pagination({
  size,
  number,
  totalElements,
  totalPages,
  path,
}: Readonly<{
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
  path: string;
}>) {
  const router = useRouter();

  const currentParams = useSearchParams();
  const newParams = new URLSearchParams();

  currentParams.forEach((value, key) => {
    if (validParams.includes(key) && value) {
      newParams.append(key, value);
    }
  });

  const finalParams = newParams.toString() ? `&${newParams}` : "";

  return (
    <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t">
      <div className="flex text-sm">
        <span className="hidden sm:block white">Showing&nbsp;</span>
        {getPaginationText(size, number, totalElements, totalPages)}
      </div>
      <div className="flex items-center space-x-2">
        <button
          className={sharedButtonStyle}
          onClick={() =>
            router.push(`/${path}?page=${number - 1}${finalParams}`)
          }
          disabled={number === 0}
        >
          <span className="block md:hidden">
            <ChevronLeft size={15} />
          </span>
          <span className="hidden md:block">Previous</span>
        </button>
        <span className="text-sm">
          Page {number + 1} of {totalPages}
        </span>
        <button
          className={sharedButtonStyle}
          onClick={() =>
            router.push(`/${path}?page=${number + 1}${finalParams}`)
          }
          disabled={number === totalPages - 1}
        >
          <span className="block md:hidden">
            <ChevronRight size={15} />
          </span>
          <span className="hidden md:block">Next</span>
        </button>
      </div>
    </div>
  );
}

function getPaginationText(
  size: number,
  number: number,
  totalElements: number,
  totalPages: number
): string {
  if (number === totalPages - 1) {
    return `${1 + size * number}-${totalElements} of ${totalElements} results`;
  }

  return `${1 + size * number}-${
    size * (number + 1)
  } of ${totalElements} results`;
}
