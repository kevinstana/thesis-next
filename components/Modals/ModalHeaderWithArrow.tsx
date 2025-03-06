import { ArrowLeft } from "lucide-react";

export default function ModalHeaderWithArrow({
  setOpen,
}: Readonly<{setOpen: (value: boolean) => void }>) {
  return (
    <div className="flex items-center border-b px-6 pt-4 pb-3 gap-4">
      <button
        className="text-gray-500 hover:bg-neutral-200 p-1 rounded-sm"
        onClick={() => {
          setOpen(false);
        }}
      >
        <ArrowLeft size={22} stroke="black" />
      </button>
      <h2 className="font-medium text-sm/[1.5rem] text-neutral-600">
        Make Request
      </h2>
    </div>
  );
}
