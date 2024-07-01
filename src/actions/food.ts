"use server";
import getServerSession from "next-auth";
import { ISession, authOptions, getAuthSession } from "@/app/auth";
import prisma from "@/lib/db";
import { getCurrentUserId } from "./user";
import { revalidatePath } from "next/cache";
import { get } from "http";

export async function getFood() {
  const userId = (await getCurrentUserId()) as string;
  const foodSettings = await prisma.foodSetting.findMany({
    where: { userId },
    orderBy: { letter: "asc" },
  });
  const sortedArray = foodSettings.sort((a, b) =>
    a.letter.localeCompare(b.letter, "uk", { sensitivity: "accent" })
  );
  return sortedArray;
}

export async function createFood({
  name,
  letter,
}: {
  name: string;
  letter: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  await prisma.foodSetting.create({
    data: {
      userId,
      name: name,
      letter: letter,
    },
  });
  revalidatePath("/");
}

export async function deleteFood({ id }: { id: string }) {
  const userId = (await getCurrentUserId()) as string;
  const food = await prisma.foodSetting.delete({
    where: { id, userId },
  });
  revalidatePath("/");
}

export async function updateFood({
  id,
  name,
  letter,
}: {
  id: string;
  name: string;
  letter: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  const food = await prisma.foodSetting.update({
    where: { id, userId },
    data: {
      name,
      letter,
    },
  });
  revalidatePath("/");
}

export async function getFoodForADay(dayId: string) {
  const userId = (await getCurrentUserId()) as string;
  const foodSettings = await prisma.foodSetting.findMany({
    where: { userId },
    orderBy: { letter: "asc" },
  });
  const dayFoods = await prisma.dayFood.findMany({
    where: { dayId, userId },
  });

  const filteredFoodSettings = foodSettings.map((foodSetting) => {
    const dayFood = dayFoods.find(
      (dayFood) =>
        dayFood.letter.toLowerCase() === foodSetting.letter.toLowerCase()
    );
    if (dayFood) {
      return {
        selected: true,
        letter: foodSetting.letter,
        name: foodSetting.name,
      };
    } else {
      return {
        selected: false,
        letter: foodSetting.letter,
        name: foodSetting.name,
      };
    }
  });
  const sortedArray = filteredFoodSettings.sort((a, b) => {
    if (a > b) return 1;
    if (a > b) return -1;
    return a.letter.localeCompare(b.letter, "uk", { sensitivity: "accent" });
  });
  return sortedArray;
}
