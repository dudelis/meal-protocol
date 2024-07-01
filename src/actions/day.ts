"use server";
import prisma from "@/lib/db";
import { getCurrentUserId } from "./user";
import { revalidatePath } from "next/cache";

export async function getDays() {
  const userId = (await getCurrentUserId()) as string;
  const days = await prisma.day.findMany({
    // where: { userId },
    orderBy: { order: "desc" },
  });
  return days;
}

export async function getDayById({ id }: { id: string }) {
  const userId = (await getCurrentUserId()) as string;
  const day = await prisma.day.findFirst({
    where: { id, userId },
  });
  return day;
}

export async function createDay({
  order,
  sportActivity,
}: {
  order: number;
  sportActivity: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  const day = await prisma.day.create({
    data: {
      userId,
      order,
      sportActivity,
    },
  });
  return day;
}

export async function deleteDay({ id }: { id: string }) {
  const userId = (await getCurrentUserId()) as string;
  await prisma.day.delete({
    where: { id, userId },
  });
  revalidatePath("/");
}

export async function updateDay({
  id,
  order,
  sportActivity,
}: {
  id: string;
  order: number;
  sportActivity: string;
}) {
  const userId = (await getCurrentUserId()) as string;
  await prisma.day.update({
    where: { id, userId },
    data: {
      order,
      sportActivity,
    },
  });
  revalidatePath("/");
}
