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
        <DialogContent className="w-auto bg-transparent p-0">
          <Card className="w-[26rem] space-y-2 bg-[#252525] px-1 py-3 shadow-xs">
            <CardHeader>
              <Logo className="cursor-default" />
            </CardHeader>
            <CardContent>
              <DialogTitle className="pb-2 text-2xl font-semibold text-neutral-300">Sign In</DialogTitle>
              <>to continue to KBoards</>
            </CardContent>

            <CardFooter>
              <div className="flex w-full flex-col items-center gap-3">
                <SocialsButton provider="google" />
                <SocialsButton provider="github" />
              </div>
            </CardFooter>
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
