import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import getSession from "@/lib/getSession";
import { getTheses } from "./actions";
import { BasicThesisPage } from "@/types/response-types";
import ThesesTable from "@/components/ThesesTable";
import { Role } from "@/types/app-types";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import GenericSearch from "@/components/Search";
import GenericFilters from "@/components/GenericFilters";
import { isValidStatus } from "@/lib/utils";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default async function ThesesPage(
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

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));
  urlSearchParams.append("query", searchParams?.query ?? "");

  const statusesStr = String(searchParams?.status);
  const statuses: string[] =
    statusesStr.length > 0 ? String(searchParams?.status).split(",") : [];

  const validStatuses: string[] = statuses.filter(isValidStatus);

  if (validStatuses.length > 0) {
    urlSearchParams.append("statuses", validStatuses.join(","));
  }

  const res = await getTheses(urlSearchParams.toString());
  const data = res.data as BasicThesisPage;

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UserDetailsProviderWrapper role={role} userId={session?.user?.id}>
          <div className="flex justify-between">
            <GenericFilters path="my-theses" />
            <GenericSearch path="my-theses" />
          </div>
          <ThesesTable thesisPage={data} path="my-theses" />
        </UserDetailsProviderWrapper>
      </NotificationProviderWrapper>
    </div>
  );
}
