import PaginationSkeleton from "@/components/Skeletons/PaginationSkeleton";
import TableSkeleton from "@/components/Skeletons/TableSkeleton";

export default function UsersLoading() {
  return (
    <div className="flex flex-col flex-1">
      <TableSkeleton />
      <PaginationSkeleton />
    </div>
  );
}
