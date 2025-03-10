"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EllipsisVertical } from "lucide-react";
import { Button } from "../ui/button";
import { CustomAction } from "@/types/app-types";
import { useState } from "react";

export default function CustomActions({
  actions,
}: {
  actions?: CustomAction[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePopoverClose = () => {
    setIsOpen(false);
  };

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger className="bg-white shadow-none rounded-md p-2 hover:bg-neutral-200">
        <EllipsisVertical color="black" />
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="end"
        alignOffset={50}
        sideOffset={-30}
        className="min-w-20 w-fit px-[6px] py-[4px]"
      >
        <div className="flex flex-col gap-y-[0.625rem]">
          {actions?.map((item) => (
            <Button
              key={item.name}
              onClick={() => {
                item.action();
                handlePopoverClose(); // Close popover after button click
              }}
              className="bg-transparent shadow-none hover:bg-neutral-200 text-black"
            >
              {item.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
