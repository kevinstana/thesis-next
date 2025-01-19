import AddExternalUserModalWrapper from "@/components/Modals/AddExtenalUserModal";
import UserTableFilters from "./UserTableFilters";

export default function UserTableOptions({
  canAddExternal = false,
  path
}: Readonly<{
  canAddExternal?: boolean;
  path: string
}>) {
  return (
    <div className="flex items-center gap-2">
      {canAddExternal ? <AddExternalUserModalWrapper /> : null}
      <div className="gap-2">
        <UserTableFilters path={path} />
      </div>
    </div>
  );
}
