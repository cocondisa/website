import { prisma } from "@/lib/prisma";

export async function getParametres() {
  return prisma.parametres.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default" },
  });
}
