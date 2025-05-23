import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationProps {
  onConfirm: () => void;
  children: React.ReactNode;
  itemType: string;
  itemName?: string;
  disabled?: boolean;
}

export function DeleteConfirmation({ onConfirm, children, itemType, itemName, disabled }: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => !disabled && setOpen(true)} style={{ display: "inline-block" }}>
        {children}
      </span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {itemType.charAt(0).toUpperCase() + itemType.slice(1)}</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            Are you sure you want to delete this {itemType}
            {itemName ? <>: <span className="font-semibold">{itemName}</span></> : null}?
            <br />
            This action cannot be undone.
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} className="cursor-pointer">
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => { setOpen(false); onConfirm(); }} className="cursor-pointer">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 