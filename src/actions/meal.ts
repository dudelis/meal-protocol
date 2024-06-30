"use server";
import { ISession, getAuthSession } from "@/app/auth";
import prisma from "@/lib/db";
import { getCurrentUserId } from "./user";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function getMeals() {
  const userId = (await getCurrentUserId()) as string;
  const mealSettings = await prisma.mealSetting.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
  return mealSettings;
}

export async function createMealAction(name: string) {
  const userId = (await getCurrentUserId()) as string;
  const lastMeal = await prisma.mealSetting.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
  });
  const order = lastMeal ? lastMeal.order + 1 : 0;
  await prisma.mealSetting.create({
    data: {
      userId,
      name: name,
      order: order,
    },
  });
  revalidatePath("/");
}

export async function deleteMeal({ id }: { id: string }) {
  const userId = (await getCurrentUserId()) as string;
  const meal = await prisma.mealSetting.delete({
    where: { id, userId },
  });
  revalidatePath("/");
}

export async function reorderMeals({
  sourceId,
  destinationId,
}: {
  sourceId: string;
  destinationId: string;
}) {
  const session = (await getAuthSession()) as ISession;
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const source = await prisma.mealSetting.findUnique({
    where: { id: sourceId },
  });
  const destination = await prisma.mealSetting.findUnique({
    where: { id: destinationId },
  });
  if (!source || !destination) {
    return Response.json({ message: "Meal not found" }, { status: 404 });
  }
  //all down up +1
  if (source.order > destination.order) {
    await prisma.mealSetting.updateMany({
      where: {
        userId: source.userId,
        order: {
          gte: destination.order,
          lte: source.order,
        },
      },
      data: {
        order: {
          increment: 1,
        },
      },
    });
    await prisma.mealSetting.update({
      where: { id: sourceId },
      data: { order: destination.order },
    });
  } else {
    await prisma.mealSetting.updateMany({
      where: {
        userId: source.userId,
        order: {
          gte: source.order,
          lte: destination.order,
        },
      },
      data: {
        order: {
          decrement: 1,
        },
      },
    });
    await prisma.mealSetting.update({
      where: { id: sourceId },
      data: { order: destination.order },
    });
  }

  revalidatePath("/");
}
