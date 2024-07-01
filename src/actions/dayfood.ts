"use server";

import prisma from "@/lib/db";
import { getCurrentUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getDayFoods(dayId: string) {
  const userId = (await getCurrentUserId()) as string;
  const dayFoods = await prisma.dayFood.findMany({
    where: { dayId, userId },
  });
  const sortedArray = dayFoods.sort((a, b) =>
    a.letter.localeCompare(b.letter, "uk", { sensitivity: "accent" })
  );
  return sortedArray;
}

export async function createDayFood({
  letter,
  meal,
  food,
  weight,
  dayId,
}: {
  letter: string;
  meal: string;
  food: string;
  weight: string;
  dayId: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  const dayFood = await prisma.dayFood.create({
    data: {
      userId,
      letter,
      meal,
      food,
      weight,
      dayId,
    },
  });
  revalidatePath("/");
}

export async function deleteDayFood({ id }: { id: string }) {
  const userId = (await getCurrentUserId()) as string;
  await prisma.dayFood.delete({
    where: { id, userId },
  });
  revalidatePath("/");
}

export async function updateDayFood({
  id,
  letter,
  meal,
  food,
  weight,
  dayId,
}: {
  id: string;
  letter: string;
  meal: string;
  food: string;
  weight: string;
  dayId: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  await prisma.dayFood.update({
    where: { id, userId },
    data: {
      letter,
      meal,
      food,
      weight,
    },
  });
  revalidatePath("/");
}
