import NavigationFirst from "@/iconography/NavigationFirst";
import NavigationLast from "@/iconography/NavigationLast";
import NavigationNext from "@/iconography/NavigationNext";
import NavigationPrevious from "@/iconography/NavigationPrevious";

const baseStyle = "disabled:opacity-40";

export default function RecordNavigation({
  list,
  value,
  setValue,
}: Readonly<{
  list: string[];
  value: string;
  setValue: (key: string) => void;
}>) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-normal text-xs text-neutral-600">
        {list.indexOf(value) + 1} of {list.length}
      </span>
      <div className="flex gap-[0.125rem]">
        <button
          className={baseStyle}
          onClick={() => setValue(list[0])}
          disabled={list.indexOf(value) === 0}
        >
          <NavigationFirst />
        </button>
        <button
          className={baseStyle}
          onClick={() => setValue(list[list.indexOf(value) - 1])}
          disabled={list.indexOf(value) === 0}
        >
          <NavigationPrevious />
        </button>

        <button
          className={baseStyle}
          onClick={() => setValue(list[list.indexOf(value) + 1])}
          disabled={list.indexOf(value) === list.length - 1}
        >
          <NavigationNext />
        </button>
        <button
          className={baseStyle}
          onClick={() => setValue(list[list.length - 1])}
          disabled={list.indexOf(value) === list.length - 1}
        >
          <NavigationLast />
        </button>
      </div>
    </div>
  );
}
