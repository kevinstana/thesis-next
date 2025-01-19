import PaginationSkeleton from "@/components/Tables/lib/Skeletons/PaginationSkeleton";
import TableSkeleton from "@/components/Tables/lib/Skeletons/TableSkeleton";

export default function UsersLoading() {
  return (
    <div className="flex flex-col flex-1">
      <TableSkeleton />
      <PaginationSkeleton />
    </div>
  );
}
