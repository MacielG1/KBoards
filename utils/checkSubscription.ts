import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { PremiumSubscription } from "@/drizzle/schema";

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

    const sub = await db.query.PremiumSubscription.findFirst({
      where: eq(PremiumSubscription.userId, userId),
    });

    if (!sub) return false;

    // is active if there is a stripePriceId and the current period end is in the future
    const isSubActive = sub.stripePriceId && (sub.stripeCurrentPeriodEnd as Date)?.getTime()! + DAY_MILISECONDS > Date.now();

    return !!isSubActive;
  } catch (error) {
    console.log("error", error);
    return false;
  }
}
