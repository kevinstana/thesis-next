import UsersTable from "@/components/UsersTable";
import UserTableOptions from "@/components/UsersTable/UserTableOptions";
import { authFetch } from "@/lib/utils";
import { HuaUserPage } from "@/types/response-types";

export default async function HuaUsersPage(props: Readonly<{
  searchParams?: Promise<{
    page?: string;
    size?: string;
  }>;
}>) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size =
    Number(searchParams?.size) >= 0 ? Number(searchParams?.size) : 10;

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));

  const usersPage: HuaUserPage = await authFetch(
    `users/hua?${urlSearchParams}`,
    "GET"
  );

  return (
    <div className="flex flex-col gap-2">
      <UserTableOptions path="hua-users" />
      <UsersTable usersPage={usersPage} path="hua-users" />
    </div>
  );
}
