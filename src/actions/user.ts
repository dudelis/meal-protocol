"use server";
import { ISession, getAuthSession } from "@/app/auth";
import prisma from "@/lib/db";
import { Session } from "inspector";

export async function getCurrentUser() {
  const session = await getAuthSession();
  if (!session || session?.user?.email === undefined) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { email: session?.user?.email },
  });
  return user;
}

export async function getCurrentUserId() {
  const session = (await getAuthSession()) as ISession;

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  if (session?.user?.id) {
    return session.user.id;
  }

  const user = await getCurrentUser();
  return user?.id;
}
