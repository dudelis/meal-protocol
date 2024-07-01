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

const formSchema = z.object({
  order: z.coerce.string().transform(v => parseInt(v)),
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
        <Button type="submit">Зберегти</Button>
      </form>
    </Form>
  )

}