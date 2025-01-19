import UsersTable from "@/components/UsersTable";
import UserTableOptions from "@/components/UsersTable/UserTableOptions";
import { authFetch } from "@/lib/utils";
import { AppUserPage } from "@/types/response-types";

export default async function ExternalUsersPage(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size =
    Number(searchParams?.size) >= 0 ? Number(searchParams?.size) : 10;

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));

  const usersPage: AppUserPage = await authFetch(
    `external-users?${urlSearchParams}`,
    "GET"
  );

  return (
    <div className="flex flex-col gap-2">
      <UserTableOptions canAddExternal path="external-users" />
      <UsersTable usersPage={usersPage} path="external-users" />
    </div>
  );
}
