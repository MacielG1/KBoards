"use server";

import { revalidatePath } from "next/cache";
import { getAbsoluteUrl } from "@/utils/getAbsoluteUrl";
import { stripe } from "@/utils/stripe";
import { CURRENT_PRICE } from "@/utils/constants";
import { db } from "@/utils/db";
import { eq } from "drizzle-orm";
import { PremiumSubscription } from "@/drizzle/schema";
import { auth } from "@/auth";

export async function stripeRedirect() {
  let url = "";
  try {
    const session = await auth();
    if (!session?.user?.id || !session?.user?.email) return { error: "Unauthorized" };

    const { id: userId, email } = session.user;

    const dashboardUrl = getAbsoluteUrl("/dashboard");

    const subscription = await db.query.PremiumSubscription.findFirst({
      where: eq(PremiumSubscription.userId, userId),
    });

    if (subscription && subscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: dashboardUrl,
      });

      url = stripeSession.url;
    } else {
      // Create a new session

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: dashboardUrl,
        cancel_url: dashboardUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: email,
        metadata: {
          userId,
        },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "KBoards Premium",
                description: "Unlock all premium features on KBoards",
              },

              unit_amount: CURRENT_PRICE,
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ],
      });

      url = stripeSession.url || "";
    }
  } catch (error) {
    console.log("error", error);
    return {
      error: "Failed to create stripe session",
    };
  }
  revalidatePath("/");

  return {
    data: url,
  };
}
