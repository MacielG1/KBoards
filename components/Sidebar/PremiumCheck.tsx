import { checkIsPremium } from "@/utils/checkSubscription";
import SubscribeButton from "./SubscribeButton";

export default async function PremiumCheck() {
  const isPremium = await checkIsPremium();
  
  if (!isPremium) {
    return <SubscribeButton />;
  }
  
  return null;
} 