"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../../prisma";
import { revalidatePath } from "next/cache";
import { getAbsoluteUrl } from "@/utils/getAbsoluteUrl";
import { stripe } from "@/utils/stripe";
import { CURRENT_PRICE } from "@/utils/constants";

export async function stripeRedirect() {
  let url = "";
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return {
        error: "Unauthorized",
      };
    }

    const settingsUrl = getAbsoluteUrl("/");

    const subscription = await prisma.premiumSubscription.findUnique({
      where: {
        userId,
      },
    });

    if (subscription && subscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: subscription.stripeCustomerId,
        return_url: settingsUrl,
      });

      url = stripeSession.url;
    } else {
      // Create a new session

      const stripeSession = await stripe.checkout.sessions.create({
        success_url: settingsUrl,
        cancel_url: settingsUrl,
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: user.emailAddresses[0].emailAddress,
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
