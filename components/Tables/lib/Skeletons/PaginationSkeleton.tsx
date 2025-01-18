import { Skeleton } from "@/components/ui/skeleton";

export default function PaginationSkeleton() {
  return (
    <div className="px-4 py-3 flex items-center justify-between">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-8 w-[200px]" />
    </div>
  );
}
