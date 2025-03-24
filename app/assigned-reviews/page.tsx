import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import getSession from "@/lib/getSession";
import { BasicThesisPage } from "@/types/response-types";
import ThesesTable from "@/components/ThesesTable";
import { Role } from "@/types/app-types";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import { getAssignedReviews } from "./actions";
import GenericSearch from "@/components/Search";
import GenericFilters from "@/components/GenericFilters";
import { isValidStatus } from "@/lib/utils";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default async function AssignedReviews(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
      status?: string;
      query?: string;
    }>;
  }>
) {
  const session = await getSession();
  const role = session?.user?.role as Role;

  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size = pageSizes.includes(String(searchParams?.size))
    ? String(searchParams?.size)
    : "15";

  const statusesStr = String(searchParams?.status);
  const statuses: string[] =
    statusesStr.length > 0 ? String(searchParams?.status).split(",") : [];

  const validStatuses: string[] = statuses.filter(isValidStatus);

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));
  urlSearchParams.append("query", searchParams?.query ?? "");

  if (validStatuses.length > 0) {
    urlSearchParams.append("statuses", validStatuses.join(","));
  }

  const res = await getAssignedReviews(urlSearchParams.toString());
  const data = res.data as BasicThesisPage;

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UserDetailsProviderWrapper role={role} userId={session?.user?.id}>
          <div className="flex justify-between">
            <GenericFilters path="assigned-reviews" />
            <GenericSearch path="assigned-reviews" />
          </div>
          <ThesesTable thesisPage={data} path="assigned-reviews" />
        </UserDetailsProviderWrapper>
      </NotificationProviderWrapper>
    </div>
  );
}
