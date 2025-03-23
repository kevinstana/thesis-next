import { X } from "lucide-react";

export default function BaseModalHeader({
  title,
  setOpen,
  cleanUp,
}: Readonly<{
  title: string;
  setOpen: (value: boolean) => void;
  cleanUp?: () => void;
}>) {
  return (
    <div className="flex items-center border-b px-6 pt-4 pb-3 justify-between">
      <h2 className="font-medium text-sm/[1.5rem] text-neutral-600 max-w-[65rem] truncate">{title}</h2>
      <button
        tabIndex={-1}
        className="text-gray-500 hover:text-gray-700"
        onClick={() => {
          setOpen(false);
          cleanUp?.();
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
