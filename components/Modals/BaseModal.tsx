import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function BaseModal({
  open,
  children,
}: Readonly<{ open: boolean; children: ReactNode }>) {
  if (!open) {
    return null;
  }

  return (
    <Dialog open={open}>
      <DialogContent className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]" aria-describedby="">
        <DialogHeader>
          <DialogTitle />
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
