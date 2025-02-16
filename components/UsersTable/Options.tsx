import AddExternalUserModalWrapper from "@/components/Modals/AddExtenalUserModal";
import UserTableFilters from "./Filters";

export default function UsersTableOptions({
  canAddExternal = false,
  path
}: Readonly<{
  canAddExternal?: boolean;
  path: string
}>) {
  return (
    <div className="flex items-center gap-1">
      {canAddExternal ? <AddExternalUserModalWrapper /> : null}
      <div className="gap-2">
        <UserTableFilters path={path} />
      </div>
    </div>
  );
}
