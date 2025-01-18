import UsersTable from "@/components/Tables/Users/UsersTable";
import { authFetch } from "@/lib/utils";
import { AppUserPage } from "@/types/response-types";

export default async function UsersPage(props: {
  searchParams?: Promise<{
    page?: string;
    size?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size = Number(searchParams?.size) >= 0 ? Number(searchParams?.size) : 10;

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));

  const usersPage: AppUserPage = await authFetch(
    `users?${urlSearchParams}`,
    "GET"
  );

  return <UsersTable usersPage={usersPage} />;
}
