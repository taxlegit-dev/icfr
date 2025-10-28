import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding users...");

  // Create sample users
  const user1 = await prisma.user.upsert({
    where: { phone: "1234567890" },
    update: {},
    create: {
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { phone: "9876543210" },
    update: {},
    create: {
      firstName: "Jane",
      lastName: "Smith",
      phone: "9876543210",
    },
  });

  const user3 = await prisma.user.upsert({
    where: { phone: "5556667777" },
    update: {},
    create: {
      firstName: "Alice",
      lastName: "Johnson",
      phone: "5556667777",
    },
  });

  console.log("Users seeded:", { user1, user2, user3 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
