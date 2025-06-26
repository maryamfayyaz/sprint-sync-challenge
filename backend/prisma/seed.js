const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const usersData = [
    { name: "Admin One", email: "admin1@example.com", password: "password", isAdmin: true },
    { name: "Admin Two", email: "admin2@example.com", password: "password", isAdmin: true },
    { name: "User One", email: "user1@example.com", password: "password", isAdmin: false },
    { name: "User Two", email: "user2@example.com", password: "password", isAdmin: false },
    { name: "User Three", email: "user3@example.com", password: "password", isAdmin: false },
  ];

  for (const userData of usersData) {
    const existing = await prisma.user.findUnique({ where: { email: userData.email } });
    if (existing) {
      console.log(`✅ User ${userData.email} already exists. Skipping.`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin,
      },
    });

    const taskStatuses = ["TODO", "IN_PROGRESS", "DONE"];
    for (const status of taskStatuses) {
      for (let i = 1; i <= 5; i++) {
        await prisma.task.create({
          data: {
            title: `${status} Task ${i}`,
            description: `This is ${status.toLowerCase()} task ${i} for ${user.name}`,
            status,
            userId: user.id,
            totalMinutes: Math.floor(Math.random() * 90 + 30), // 30 to 120 min
          },
        });
      }
    }

    console.log(`🌱 Created user ${user.email} and tasks`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
