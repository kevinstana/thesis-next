import UsersTable from "@/components/Tables/Users/UsersTable";
import { authFetch } from "@/lib/utils";
import { AppUserPage } from "@/types/response-types";

export default async function UsersPage() {
  const usersPage: AppUserPage = await authFetch("users", "GET");

  return <UsersTable usersPage={usersPage} />;
}
