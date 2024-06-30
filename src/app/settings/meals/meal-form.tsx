"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
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
import { createMealAction } from "@/actions/meal";

const formSchema = z.object({
  name: z.string().min(1, "Ну то треба хоч щось написати").max(50),
})

export function MealForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ""
    },
  })

  // // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createMealAction(values.name);
    form.reset({
      name: ""
    });
  }

  return (
    <Form {...form}>
      <form
        //action={createMealAction}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2">
        <FormField

          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>
              <FormControl>
                <Input placeholder="Сніданок, обід, перекус..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Додати</Button>
      </form>
    </Form>
  )
}
