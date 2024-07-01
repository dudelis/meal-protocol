import { deleteDay } from "@/actions/day";
import { Spacer } from "@/components/spacer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TrashIcon } from "@heroicons/react/24/solid";
import { Space } from "lucide-react";
import { useState } from "react";


export const DayDialog = ({ id }: { id: string }) => {
  const [open, setOpen] = useState(false);

  //onClick={async () => await deleteDay({ id: row.original.id })}

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <div className="bg-destructive text-white p-2 rounded">
          <TrashIcon className="h-4 w-4" onClick={() => setOpen(true)} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ви впевнені, що видаляєте цілий день?</DialogTitle>
          <Spacer />
          <DialogDescription>
            Цю дію не можна скасувати.
          </DialogDescription>
        </DialogHeader>
        <Spacer />
        <DialogFooter className="flex flex-row justify-between">
          <Button variant="destructive" onClick={
            async () => {
              await deleteDay({ id: id });
              setOpen(false);
            }
          }>Видаляти</Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Скасувати</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}