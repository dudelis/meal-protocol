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
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TDayFood } from "@/types/TDayFood"
import { useEffect, useState } from "react"
import { get } from "http"
import { getMeals } from "@/actions/meal"
import { getFoodForADay } from "@/actions/food"
import { createDayFood, updateDayFood } from "@/actions/dayfood"

const formSchema = z.object({
  letter: z.string().min(1, "Ну треба щось обрати"),
  meal: z.string().min(1, "Ну треба щось обрати"),
  food: z.string().min(1),
  weight: z.string().min(1)
})

export type TDayFoodFormProps = {
  data: TDayFood;
}


export function DayFoodForm({ data }: TDayFoodFormProps) {
  const router = useRouter();
  const [meals, setMeals] = useState<string[]>([]);
  const [foods, setFoods] = useState<{ letter: string, name: string, selected: boolean }[]>([]);

  useEffect(() => {
    getMeals().then((meals) => {
      setMeals(meals.map((meal) => meal.name));
    });
    getFoodForADay(data.dayId).then((foods) => {
      setFoods(foods.map((food) => ({ letter: food.letter, name: food.name, selected: false })));
    });
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meal: data.meal,
      letter: data.letter,
      food: data.food,
      weight: data.weight
    }
  });

  // 2. Define a submit handler.
  // // 2. Define a submit handler.
  async function onSubmit(value: z.infer<typeof formSchema>) {

    console.log(value);
    const values = form.getValues();
    if (data.id) {
      await updateDayFood({ id: data.id, dayId: data.dayId, ...values });
      router.back();
    } else {
      const day = await createDayFood({ dayId: data.dayId, ...values });
    }

    // form.reset({
    //   meal: "",
    //   letter: "",
    //   food: "",
    // });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-2 flex flex-col gap-6 w-full"
      >
        <FormField
          control={form.control}
          name="meal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Прийом їжі</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть прийом їжі" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {meals.map((meal, index) => <SelectItem key={index} value={meal}>{meal}</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="letter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Оберіть літеру</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Оберіть прийом їжі" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className=" w-min">
                  <SelectGroup>
                    {foods.filter((food) => !(food.selected)).map((food, index) =>
                      <SelectItem key={index} value={food.letter} className="" >
                        {`${food.letter}) ${food.name}`}
                      </SelectItem>)}
                  </SelectGroup>
                  <SelectSeparator />
                  {/* <div className="h-[1px] bg-foreground my-2"></div> */}
                  <SelectGroup>
                    {foods.filter((food) => food.selected).map((food, index) =>
                      <SelectItem key={index} value={food.letter} className="" >
                        {`${food.letter}) ${food.name}`}
                      </SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="food"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Що і скільки з&apos;їв?</FormLabel>

              <FormControl>
                <Textarea placeholder="" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" onClick={() => form.handleSubmit(onSubmit)}>Зберегти</Button>

      </form>
    </Form>
  )

}