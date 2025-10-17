import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
 import prisma from "../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return Response.json({ message: "Not logged in" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return Response.json({ isPremium: user?.isPremium || false });
}
