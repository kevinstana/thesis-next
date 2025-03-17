import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import ThesesTableOptions from "@/components/ThesesTable/Options";
import getSession from "@/lib/getSession";
import { getTheses } from "./actions";
import { BasicThesisPage } from "@/types/response-types";
import ThesesTable from "@/components/ThesesTable";
import { Role } from "@/types/app-types";
import ThesisSearch from "@/components/ThesisSearch";
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
  const userId = session?.user?.id;
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

  if (validStatuses.length > 0) {
    urlSearchParams.append("statuses", validStatuses.join(","));
  } else {
    urlSearchParams.append("statuses", "AVAILABLE");
  }

  if (searchParams?.query) {
    urlSearchParams.delete("statuses");
    urlSearchParams.append("query", searchParams.query);
  }

  const res = await getTheses(urlSearchParams.toString());
  const data = res.data as BasicThesisPage;

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UserDetailsProviderWrapper userId={userId} role={role}>
          <div className="flex justify-between items-center">
            <ThesesTableOptions path="theses" role={role} />
            <ThesisSearch />
          </div>
          <ThesesTable thesisPage={data} path="theses" />
        </UserDetailsProviderWrapper>
      </NotificationProviderWrapper>
    </div>
  );
}
