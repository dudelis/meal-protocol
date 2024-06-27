import { getAuthSession } from "@/app/auth";

import prisma from "@/lib/db";

export async function GET(req: Request) {
  const session = await getAuthSession();
  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }
  console.log(JSON.stringify(session, null, 2));
  return null;
}
