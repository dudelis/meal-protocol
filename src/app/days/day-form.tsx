"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createDay, updateDay } from "@/actions/day"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Day } from "react-day-picker"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { DayFoodForm } from "./[id]/dayfood-form"

const formSchema = z.object({
  order: z.coerce.number().min(1, "Номер дня має бути більше 0"),
  sportActivity: z.string(),
})

export type TDayFormProps = {
  id: string;
  order: number;
  sportActivity: string;
}

export function DayForm(params: TDayFormProps) {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      order: params.order,
      sportActivity: params.sportActivity
    }
  });

  // 2. Define a submit handler.
  // // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (params.id) {
      await updateDay({ id: params.id, ...values });
      router.back();
    } else {
      const day = await createDay(values);
      router.push(`/days/${day.id}`)
    }
    form.reset({
      order: 0,
      sportActivity: ""
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2">
        <FormField
          control={form.control}
          name="order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Який день?</FormLabel>
              <FormControl>
                <Input type="number" placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sportActivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Як щодо спорту?</FormLabel>
              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-between p-4">
          <Button type="submit">Зберегти</Button>
          {params.id &&
            <Sheet>
              <SheetTrigger>
                <span className="rounded text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" >Додати їжу</span>
                {/* <PlusCircleIcon className="h-12 w-12 text-primary cursor-pointer rounded-full active:scale-95 active:bg-gray-200 transition duration-150 ease-in-out" /> */}
              </SheetTrigger>
              <SheetContent className="w-full sm:3/4 md:w-3/4 lg:w-3/4 sm:max-w-lg md:max-w-lg ">
                <SheetHeader>
                  <SheetTitle>Що з&apos;їв - записуй!</SheetTitle>
                  <SheetDescription>
                    <DayFoodForm
                      data={{
                        id: "",
                        meal: "",
                        letter: "",
                        food: "",
                        weight: "",
                        dayId: params.id
                      }}
                    />
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            // 
          }
        </div>


      </form>
    </Form>
  )

}