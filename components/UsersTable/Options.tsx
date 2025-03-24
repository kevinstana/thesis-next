import AddExternalUserModalWrapper from "@/components/Modals/AddExtenalUserModal";
import UserTableFilters from "./Filters";
import GenericSearch from "../Search";

export default function UsersTableOptions({
  canAddExternal = false,
  path,
}: Readonly<{
  canAddExternal?: boolean;
  path: string;
}>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        {canAddExternal ? <AddExternalUserModalWrapper /> : null}
        <UserTableFilters path={path} />
      </div>

      <GenericSearch path={path} />
    </div>
  );
}
