import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SocialsButton from "./SocialsButton";

type Props = {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
};

export default function LoginModal({ children, mode = "modal", asChild }: Props) {
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="border-none bg-transparent p-0 shadow-none sm:max-w-[425px]">
          <Card className="relative overflow-hidden border-neutral-800 bg-neutral-900/95 shadow-2xl backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent opacity-20" />

            <CardHeader className="relative flex flex-col items-center gap-2 pt-8 pb-2">
              <Logo className="scale-125 cursor-default pb-4" />
              <DialogTitle className="text-2xl font-semibold text-neutral-300">Sign In</DialogTitle>
            </CardHeader>

            <CardContent className="relative flex flex-col gap-4 px-8 py-6 pb-10">
              <SocialsButton provider="google" />
              <SocialsButton provider="github" />
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    );
  }

  // return (
  //   <span onClick={() => router.push("/login")} className="cursor-pointer">
  //     {children}
  //   </span>
  // );
}
