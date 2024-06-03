import { checkIsPremium } from "@/utils/checkSubscription";
import SubButton from "./SubButton";

export async function SubButtonParent() {
  const isPremium = await checkIsPremium();

  return <SubButton isPremium={isPremium} />;
}
