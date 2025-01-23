import { X } from "lucide-react";

export default function BaseModalHeader({
  title,
  setOpen,
}: Readonly<{ title: string; setOpen: (value: boolean) => void }>) {
  return (
    <div className="flex items-center border-b px-6 pt-4 pb-3 justify-between">
      <h2 className="font-medium text-sm/[1.5rem] text-neutral-600">
        {title}
      </h2>
      <button
        className="text-gray-500 hover:text-gray-700"
        onClick={() => {
          setOpen(false);
        }}
      >
        <X size={18} />
      </button>
    </div>
  );
}
