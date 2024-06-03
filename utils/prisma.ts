import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
    transactionOptions: {
      timeout: 8000,
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => {
//   const prismaClient = new PrismaClient({
//     log: ["query"],
//   });

//   prismaClient.$on("query", (e) => {
//     console.log("----------------------------------------------------------------------------------");
//     console.log("Query: " + e);
//   });

//   return prismaClient;
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// export default prisma;

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
