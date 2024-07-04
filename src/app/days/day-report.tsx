import { deleteDay, getDayById } from "@/actions/day";
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
import { Textarea } from "@/components/ui/textarea";
import { groupDayFoodsByMeal } from "@/lib/utils";
import { DayFood, Prisma } from "@prisma/client";
import { set } from "date-fns";
import { MessageSquareWarning, Clipboard } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";


export type TDayWithDayFoods = Prisma.DayGetPayload<{ include: { dayFoods: true } }>;

export const DayReportDialog = ({ dayId }: { dayId: string }) => {
  const [open, setOpen] = useState(false);
  const [day, setDay] = useState<TDayWithDayFoods | null>(null);
  const [dayFoods, setDayFoods] = useState<Record<string, DayFood[]>>({});
  const [report, setReport] = useState<string | null>(null);

  useEffect(() => {
    getDayById({ id: dayId }).then((day) => {
      setDay(day as TDayWithDayFoods);
      if (day) {
        setDayFoods(groupDayFoodsByMeal(day.dayFoods));
        setReport(
          `День ${day.order} ${String.fromCharCode(13)}` +
          `${Object.keys(dayFoods).map((key) => {
            return (
              `${String.fromCharCode(13, 10)}${key}${String.fromCharCode(13, 10)}` +
              `${dayFoods[key].map((dayFood) => {
                return (
                  `${dayFood.letter}) ${dayFood.food}${String.fromCharCode(13, 10)}`
                )
              }).join("")}`
            )
          }).join("")
          }` +
          `${String.fromCharCode(13, 10)}Спортивна активність: ${String.fromCharCode(13, 10)}` +
          `${day.sportActivity}${String.fromCharCode(13)}`
        );
      }
    });
    return () => {
      // Cleanup logic here if needed
    };
  }, [open, dayId]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger>
        <div className="bg-destructive text-white p-2 rounded flex">
          <MessageSquareWarning className="h-6 w-6" />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Звіт для тренера</DialogTitle>
          <Spacer />
          {day &&
            <DialogDescription>
              <Textarea readOnly value={report as string} onChange={(e) => setReport(e.target.value)} className="h-96" />
            </DialogDescription>}
        </DialogHeader>
        <Spacer />
        <DialogFooter className="flex flex-row sm:justify-between justify-between">
          <Button variant="default" onClick={() => navigator.clipboard.writeText(report?.toString() as string)}><Clipboard /></Button>
          <Button variant="outline" onClick={() => setOpen(false)}>Зачинити</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}