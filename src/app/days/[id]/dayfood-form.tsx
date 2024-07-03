"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCallback, useEffect, useState } from "react"
import { getMeals } from "@/actions/meal"
import { getFoodForADay } from "@/actions/food"
import { createDayFood, updateDayFood } from "@/actions/dayfood"
import { useRouter } from "next/navigation"
import { DayFood } from "@prisma/client"


const formSchema = z.object({
  letter: z.string().min(1, "Ну треба щось обрати"),
  meal: z.string().min(1, "Ну треба щось обрати"),
  food: z.string().min(1, "От прям нічого не з'їли?")
})

export type TDayFoodFormProps = {
  data: DayFood;
  children: React.ReactNode;
}

export function DayFoodForm({ data, children }: TDayFoodFormProps) {
  const [meals, setMeals] = useState<string[]>([]);
  const [foods, setFoods] = useState<{ letter: string, name: string, selected: boolean }[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);




  const requestData = useCallback(() => {
    getMeals().then((meals) => {
      setMeals(meals.map((meal) => meal.name));
    });
    getFoodForADay(data.dayId).then((foods) => {
      setFoods(foods.map((food) => ({ letter: food.letter, name: food.name, selected: food.selected })));
    });
  }, [data.dayId]);


  useEffect(() => requestData(), []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meal: data.meal,
      letter: data.letter,
      food: data.food,
    },
    mode: "all",
  });

  // 2. Define a submit handler.
  // // 2. Define a submit handler.
  async function handleSubmit() {
    await form.trigger();
    if (!form.formState.isValid) return;
    const values = form.getValues();
    if (data.id) {
      await updateDayFood({ id: data.id, dayId: data.dayId, ...values });
    } else {
      await createDayFood({ dayId: data.dayId, ...values });
    }
    form.reset({
      letter: "",
      food: "",
      meal: values.meal,
    });
    setSheetOpen(false);
    requestData();
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={() => setSheetOpen(!sheetOpen)} >
      <SheetTrigger>
        {children}
        {/* <span className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2" >Додати їжу</span> */}
        {/* <PlusCircleIcon className="h-12 w-12 text-primary cursor-pointer rounded-full active:scale-95 active:bg-gray-200 transition duration-150 ease-in-out" /> */}
      </SheetTrigger>
      <SheetContent className="w-full sm:3/4 md:w-3/4 lg:w-3/4 sm:max-w-lg md:max-w-lg ">
        <SheetHeader>
          <SheetTitle>Що з&apos;їв - записуй!</SheetTitle>

          <Form {...form}>
            <form
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
                        <SelectGroup className="bg-destructive">
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
              <Button type="button" onClick={() => handleSubmit()}>Зберегти</Button>
            </form>
          </Form>
        </SheetHeader>
      </SheetContent>
    </Sheet >
  )

}