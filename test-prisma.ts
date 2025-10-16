import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  const users = await prisma.user.findMany();
  console.log(users);
  await prisma.$disconnect();
}

test().catch(console.error);
