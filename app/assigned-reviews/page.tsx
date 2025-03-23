import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import getSession from "@/lib/getSession";
import { BasicThesisPage } from "@/types/response-types";
import ThesesTable from "@/components/ThesesTable";
import { Role } from "@/types/app-types";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import { getAssignedReviews } from "./actions";
import AssignedReviewsSearch from "./search";
import Filters from "./filters";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default async function AssignedReviews(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
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

  const res = await getAssignedReviews(urlSearchParams.toString());
  const data = res.data as BasicThesisPage;

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UserDetailsProviderWrapper role={role} userId={session?.user?.id}>
          <div className="flex justify-between">
            <Filters path="assigned-reviews" />
            <AssignedReviewsSearch />
          </div>
          <ThesesTable thesisPage={data} path="assigned-reviews" />
        </UserDetailsProviderWrapper>
      </NotificationProviderWrapper>
    </div>
  );
}
