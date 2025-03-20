import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { clsx } from "clsx";

export default function BaseModal({
  open,
  children,
  className,
}: Readonly<{ open: boolean; children: ReactNode, className?: string }>) {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={() => { setTimeout(() => (document.body.style.pointerEvents = ""), 100) }}>
      <DialogContent className={clsx("fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center", className)} aria-describedby="">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
