// import { ITEMS_LIMIT } from "@/utils/constants";
// import prisma from "@/utils/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function increaseItemCount() {
//   try {
//     const { userId } = auth();

//     if (!userId) throw new Error("Unauthorized");

//     const limit = await prisma.freeTierLimit.findUnique({
//       where: {
//         userId,
//       },
//     });

//     if (!limit) {
//       await prisma.freeTierLimit.create({
//         data: {
//           userId,
//           itemsCount: 1,
//         },
//       });
//     } else {
//       await prisma.freeTierLimit.update({
//         where: {
//           userId,
//         },
//         data: {
//           itemsCount: limit.itemsCount + 1,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("increaseItemCount error", error);
//     return error;
//   }
// }
// export async function decreaseItemCount() {
//   try {
//     const { userId } = auth();

//     if (!userId) throw new Error("Unauthorized");

//     const limit = await prisma.freeTierLimit.findUnique({
//       where: {
//         userId,
//       },
//     });

//     if (!limit) {
//       return;
//     } else {
//       await prisma.freeTierLimit.update({
//         where: {
//           userId,
//         },
//         data: {
//           itemsCount: limit.itemsCount > 0 ? limit.itemsCount - 1 : 0,
//         },
//       });
//     }
//   } catch (error) {
//     console.error("decreaseItemCount error", error);
//     return error;
//   }
// }

// export async function hasAvailableItems() {
//   try {
//     const { userId } = auth();

//     if (!userId) throw new Error("Unauthorized");

//     const limit = await prisma.freeTierLimit.findUnique({
//       where: {
//         userId,
//       },
//     });

//     if (!limit || limit.itemsCount < ITEMS_LIMIT) return true;
//     else return false;
//   } catch (error) {
//     console.error("hasAvailableItems error", error);
//     return error;
//   }
// }

// export async function getAvailableItemCount() {
//   try {
//     const { userId } = auth();

//     if (!userId) throw new Error("Unauthorized");

//     const limit = await prisma.freeTierLimit.findUnique({
//       where: {
//         userId,
//       },
//     });

//     if (!limit) return ITEMS_LIMIT;
//     else return ITEMS_LIMIT - limit.itemsCount;
//   } catch (error) {
//     console.error("getAvailableItemCount error", error);
//     return error;
//   }
// }
