import Google from "@/assets/icons/google";
import Github from "@/assets/icons/github";
import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function SocialsButton({ provider }: { provider: "google" | "github" }) {
  if (provider === "google") {
    return (
      <form
        className="w-full"
        action={async () => {
          "use server";
          await signIn("google", { callbackUrl: "/dashboard" });
        }}
      >
        <Button
          className="w-full duration-300 hover:ring-1 hover:ring-neutral-700 hover:ring-offset-0 hover:ring-offset-transparent dark:bg-neutral-950 dark:hover:bg-neutral-950/50"
          type="submit"
          size="lg"
          variant="outline"
        >
          <Google className="mr-3 size-6" />
          Continue with Google
        </Button>
      </form>
    );
  }

  if (provider === "github") {
    return (
      <form
        className="w-full"
        action={async () => {
          "use server";
          await signIn("github", { callbackUrl: "/dashboard" });
        }}
      >
        <Button
          type="submit"
          className="w-full bg-neutral-950 duration-300 hover:bg-neutral-950/50 hover:ring-1 hover:ring-neutral-700 hover:ring-offset-0 hover:ring-offset-transparent"
          size="lg"
          variant="outline"
        >
          <Github className="mr-3 size-6 text-white" />
          Continue with GitHub
        </Button>
      </form>
    );
  }
}
