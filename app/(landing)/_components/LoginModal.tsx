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
        <DialogContent className="w-auto bg-transparent p-0 flex justify-center items-center">
          <Card className="w-[26rem] space-y-4 bg-[#1f1f1f] px-6 py-4 shadow-lg rounded-lg">
            <CardHeader className="flex justify-center">
              <Logo className="cursor-default" />
            </CardHeader>
            <CardContent className="text-center">
              <DialogTitle className="pb-2 text-2xl font-semibold text-neutral-300">Sign In</DialogTitle>
              <>to continue to KBoards</>
            </CardContent>

            <CardFooter className="flex justify-center">
              <div className="flex w-full flex-col items-center gap-4">
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
