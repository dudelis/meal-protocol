"use server";
import getServerSession from "next-auth";
import { ISession, authOptions, getAuthSession } from "@/app/auth";
import prisma from "@/lib/db";
import { getCurrentUser, getCurrentUserId } from "./user";

export async function getFood() {
  const session = (await getAuthSession()) as ISession;
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  const userId = (await getCurrentUserId()) as string;
  const foodSettings = await prisma.foodSetting.findMany({
    where: { userId },
  });
  return foodSettings;
}
