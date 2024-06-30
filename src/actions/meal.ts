"use server";
import getServerSession from "next-auth";
import { ISession, authOptions, getAuthSession } from "@/app/auth";
import prisma from "@/lib/db";
import { getCurrentUser, getCurrentUserId } from "./user";

export async function getMeals() {
  const session = (await getAuthSession()) as ISession;
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (await getCurrentUserId()) as string;
  const mealSettings = await prisma.mealSetting.findMany({
    where: { userId },
    orderBy: { order: "asc" },
  });
  return mealSettings;
}

export async function createMeal({ name }: { name: string }) {
  const session = (await getAuthSession()) as ISession;
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (await getCurrentUserId()) as string;
  const lastMeal = await prisma.mealSetting.findFirst({
    where: { userId },
    orderBy: { order: "desc" },
  });
  const order = lastMeal ? lastMeal.order + 1 : 0;
  const meal = await prisma.mealSetting.create({
    data: {
      userId,
      name: name,
      order: order,
    },
  });
  return meal;
}

export async function deleteMeal({ id }: { id: string }) {
  const session = (await getAuthSession()) as ISession;
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const meal = await prisma.mealSetting.delete({
    where: { id },
  });
  return meal;
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

  // const startOrder =
  //   source.order > destination.order ? destination.order : source.order;
  // const endOrder =
  //   source.order > destination.order ? source.order : destination.order;

  // for (let i = startOrder; i <= endOrder; i++) {}

  // await prisma.mealSetting.update({
  //   where: { id: sourceId },
  //   data: { name: destination.name },
  // });
  // await prisma.mealSetting.update({
  //   where: { id: destinationId },
  //   data: { name: source.name },
  // });
  return { source, destination };
}
