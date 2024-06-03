import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "./prisma";

const DAY_MILISECONDS = 86400000;

export async function checkIsPremium() {
  try {
    const { userId } = auth();

    if (!userId) {
      console.log("No user found");
      return false;
    }

    const user = await clerkClient.users.getUser(userId);
    if (user?.privateMetadata?.isPremium === "true") return true;

    const sub = await prisma.premiumSubscription.findUnique({
      where: {
        userId,
      },

      select: {
        stripeCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripePriceId: true,
        stripeSubscriptionId: true,
      },
    });

    if (!sub) return false;

    // is active if there is a stripePriceId and the current period end is in the future

    const isSubActive = sub.stripePriceId && sub.stripeCurrentPeriodEnd?.getTime()! + DAY_MILISECONDS > Date.now();

    return !!isSubActive;
  } catch (error) {
    return false;
  }
}
