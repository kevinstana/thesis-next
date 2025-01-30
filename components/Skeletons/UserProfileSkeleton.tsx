import { Skeleton } from "../ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <div className="h-full w-full space-y-9 bg-white px-6 pt-5">
      {Array.from({ length: 2 }, (_, k) => (
        <div key={k} className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}

      <div className="flex space-x-6">
        {Array.from({ length: 2 }, (_, k) => (
          <div key={k} className="space-y-1 w-full">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      {Array.from({ length: 2 }, (_, k) => (
        <div key={k} className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}

      <div className="flex space-x-6">
        {Array.from({ length: 2 }, (_, k) => (
          <div key={k} className="space-y-1 w-full">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>

      <div className="flex pb-8 pt-2 gap-2 justify-end">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
