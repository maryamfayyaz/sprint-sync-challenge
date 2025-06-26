const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

function randomDateWithinLast7Days(offsetMinutes = 30) {
  const daysAgo = Math.floor(Math.random() * 7);
  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - daysAgo);

  const start = new Date(baseDate);
  start.setHours(9, 0, 0, 0); // Start around 9AM

  const end = new Date(baseDate);
  end.setHours(18, 0, 0, 0); // End around 6PM

  const timestamp = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  const inProgressAt = new Date(timestamp);
  const completedAt = new Date(timestamp.getTime() + offsetMinutes * 60000); // offset duration

  return { inProgressAt, completedAt, totalMinutes: offsetMinutes };
}

async function main() {
  const usersData = [
    {
      name: "Admin One",
      email: "admin1@example.com",
      password: "password",
      isAdmin: true,
    },
    {
      name: "Admin Two",
      email: "admin2@example.com",
      password: "password",
      isAdmin: true,
    },
    {
      name: "User One",
      email: "user1@example.com",
      password: "password",
      isAdmin: false,
    },
    {
      name: "User Two",
      email: "user2@example.com",
      password: "password",
      isAdmin: false,
    },
    {
      name: "User Three",
      email: "user3@example.com",
      password: "password",
      isAdmin: false,
    },
  ];

  for (const userData of usersData) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });
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
        const { inProgressAt, completedAt, totalMinutes } =
          randomDateWithinLast7Days(Math.floor(Math.random() * 90 + 30));
        let createdAt = null;
        if (inProgressAt) {
          createdAt = new Date(
            inProgressAt.getTime() - Math.floor(Math.random() * 25 + 5) * 60000
          );
        } else {
          // fallback for TODO tasks
          createdAt = new Date();
        }
        const taskData = {
          title: `${status} Task ${i}`,
          description: `This is ${status.toLowerCase()} task ${i} for ${
            user.name
          }`,
          status,
          userId: user.id,
          inProgressAt: status !== "TODO" ? inProgressAt : null,
          completedAt: status === "DONE" ? completedAt : null,
          totalMinutes: status === "DONE" ? totalMinutes : 0,
          createdAt,
        };

        await prisma.task.create({ data: taskData });
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
