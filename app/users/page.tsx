import UsersTable from "@/components/Tables/Users/UsersTable";
import UserTableOptions from "@/components/Tables/Users/UserTableOptions";
import { authFetch, isValidRole } from "@/lib/utils";
import { Role } from "@/types/app-types";
import { AppUserPage } from "@/types/response-types";

export default async function UsersPage(props: {
  searchParams?: Promise<{
    page?: string;
    size?: string;
    roles?: string;
    enabled?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size =
    Number(searchParams?.size) >= 0 ? Number(searchParams?.size) : 10;

  const rolesStr = String(searchParams?.roles);
  const roles: string[] =
    rolesStr.length > 0 ? String(searchParams?.roles).split(",") : [];

  const validRoles: Role[] = roles.filter(isValidRole);

  const enabled = String(searchParams?.enabled);

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));
  validRoles ? urlSearchParams.append("roles", validRoles.join(",")) : null;
  enabled === "true" ? urlSearchParams.append("enabled", "true") : null;
  enabled === "false" ? urlSearchParams.append("enabled", "false") : null;

  const usersPage: AppUserPage = await authFetch(
    `users?${urlSearchParams}`,
    "GET"
  );

  return (
    <div className="flex flex-col gap-2">
      <UserTableOptions path="users"/>
      <UsersTable usersPage={usersPage} path="users" />
    </div>
  );
}
