import { Skeleton } from "@/components/ui/skeleton";

export default function SidebarSkeleton() {
  return (
    <div className="flex w-[13rem] min-w-[13rem] max-w-[13rem] flex-col p-4">
      <h1 className="mb-5 mt-2 whitespace-nowrap text-center text-xl tracking-wider">Boards</h1>
      {[1, 2, 3].map((i) => (
        <div className="flex gap-x-2" key={i}>
          <Skeleton
            className="mb-3 h-8 w-[100%]"
            style={{
              backgroundColor: "var(--board-default)",
            }}
          />
        </div>
      ))}
      <div className="mx-auto pt-3">
        <Skeleton
          className="h-10 w-28 rounded-xl"
          style={{
            backgroundColor: "var(--board-default)",
          }}
        />
      </div>
      <div className="grow"></div>
    </div>
  );
}
