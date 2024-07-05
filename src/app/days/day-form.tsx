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
import { Spacer } from "@/components/spacer"
import { Save } from "lucide-react"
import { Spinner } from "@/components/Spinner"
import { useState } from "react"

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
  const [spinner, setSpinner] = useState(false);
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
    setSpinner(true);
    if (params.id) {
      await updateDay({ id: params.id, ...values });
      // router.back();
    } else {
      const day = await createDay(values);
      router.push(`/days/${day.id}`)
    }
    setSpinner(false);
    // form.reset({
    //   order: 0,
    //   sportActivity: ""
    // });
  }

  return (
    <>
      <Spinner show={spinner} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <h3 className="py-4 text-2xl font-semibold leading-none tracking-tight text-center">Треба все записати</h3>
          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Номер дня?</FormLabel>
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
          <Spacer />
          <div className="flex justify-between py-4">
            <Button type="submit" className="w-full">
              <Save className="mr-2" />Зберегти
            </Button>
          </div>
        </form>
      </Form>
    </>
  )

}