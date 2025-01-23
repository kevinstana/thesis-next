import UsersTable from "@/components/UsersTable";
import UserTableOptions from "@/components/UsersTable/Options";
import { isValidRole } from "@/lib/utils";
import { Role } from "@/types/app-types";
import { AppUserPage } from "@/types/response-types";
import { getAllUsers } from "./actions";

export default async function UsersPage(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
      roles?: string;
      enabled?: string;
    }>;
  }>
) {
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

  if (validRoles.length > 0) {
    urlSearchParams.append("roles", validRoles.join(","));
  }

  if (enabled === "true") {
    urlSearchParams.append("enabled", "true");
  } else if (enabled === "false") {
    urlSearchParams.append("enabled", "false");
  }

  const res = await getAllUsers(urlSearchParams.toString());
  const data = res.data as AppUserPage;

  return (
    <div className="flex flex-col gap-2">
      <UserTableOptions path="users" />
      <UsersTable usersPage={data} path="users" />
    </div>
  );
}
