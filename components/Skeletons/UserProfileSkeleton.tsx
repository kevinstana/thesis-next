import { Skeleton } from "../ui/skeleton";

export default function UserProfileSkeleton() {
  return (
    <div className="h-full w-full space-y-9 bg-white px-6 pt-5">
      {Array.from({ length: 7 }, (_, k) => (
        <div key={k} className="space-y-1">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}

      <div className="flex gap-2 justify-end">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
