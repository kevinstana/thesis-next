import UsersTable from "@/components/UsersTable";
import UsersTableOptions from "@/components/UsersTable/Options";
import { isValidRole } from "@/lib/utils";
import { Role } from "@/types/app-types";
import { UserPage } from "@/types/response-types";
import { getExternalUsers } from "./actions";
import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import UserPageTransformation from "@/transformations/UserPageTransformation";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default async function ExternalUsersPage(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
      roles?: string;
      enabled?: string;
      query?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size = pageSizes.includes(String(searchParams?.size))
    ? String(searchParams?.size)
    : "15";

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

  if (searchParams?.query) {
    urlSearchParams.delete("roles");
    urlSearchParams.delete("enabled");
    urlSearchParams.append("query", searchParams.query);
  }

  const res = await getExternalUsers(urlSearchParams.toString());
  const data = res.data as UserPage;
  const transformedUserPage = UserPageTransformation(data);

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UsersTableOptions canAddExternal path="external-users" />
        <UsersTable usersPage={transformedUserPage} path="external-users" />
      </NotificationProviderWrapper>
    </div>
  );
}
