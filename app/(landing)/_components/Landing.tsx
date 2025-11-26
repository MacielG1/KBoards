import Image from "next/image";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import LoginModal from "./LoginModal";

export default function Landing() {
  return (
    <div className="relative isolate h-[100vh] w-full overflow-hidden bg-gray-900">
      <nav className="fixed top-0 flex h-14 w-full items-center border-b border-gray-800 px-4 shadow-xs">
        <div className="mx-auto flex w-full items-center justify-between md:max-w-(--breakpoint-2xl)">
          <Logo />
          <div className="block w-auto items-center justify-end space-x-4">
            <LoginModal asChild>
              <Button className="text-lg" variant="primary" size="md">
                Sign In
              </Button>
            </LoginModal>
          </div>
        </div>
      </nav>
      <div
        className="absolute top-5 left-[calc(50%-4rem)] -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] xl:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
        aria-hidden="true"
      >
        <div
          className="aspect-1108/632 w-[80rem] bg-linear-to-r from-[#63ffa9] to-[#16d857] opacity-20"
          style={{
            clipPath:
              "polygon(15% 41.7%, 88.7% 40.8%, 90% 99.2%, 60% 8%, 70% 88%, 65.2% 50%, 52% 37%, 20% 70%, 35% 60%, 40.3% 67%, 16% 74.1%, 69% 30%, 5.4% 41.1%, 25% 69%, 43.9% 10.2%, 83.6% 81.7%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-[100rem] px-6 pt-4 pb-24 sm:pb-32 xl:flex xl:px-8 2xl:pt-24">
        <div className="mx-auto max-w-2xl shrink-0 px-8 xl:mx-0 xl:max-w-lg xl:pt-3 2xl:max-w-xl 2xl:pt-8">
          <h1 className="mt-12 text-4xl font-bold tracking-tight text-balance text-white sm:text-6xl sm:leading-tight">Organize your ideas</h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            Kboards makes it easy for you to stay on top of your tasks. The simple and intuitive interface lets you arrange everything the way you prefer
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <LoginModal asChild>
              <Button className="text-lg" variant="primary" size="md">
                Join
              </Button>
            </LoginModal>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl items-center sm:mt-24 xl:mt-5 xl:mr-0 xl:ml-16 xl:max-w-none xl:flex-none 2xl:ml-32">
          <div className="max-w-3xl flex-none sm:max-w-2xl md:max-w-2xl lg:max-w-4xl xl:max-w-[95rem]">
            <Image
              priority
              src="/listsdark.png"
              alt="App screenshot"
              width={1500}
              height={400}
              className="w-[50rem] rounded-md bg-white/5 px-1 py-8 shadow-2xl ring-1 ring-white/10"
            />
          </div>
        </div>
      </div>
      <footer className="absolute bottom-0 w-full border-t border-t-gray-800">
        <div className="mx-auto max-w-7xl px-6 py-10 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2"></div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">&copy; {new Date().getFullYear()} MacielG1. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
