import PublishedList from "@/components/Published";
import { getPublished } from "./actions";
import { PublishedPage } from "@/types/response-types";
import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";

const pageSizes: string[] = ["5", "10", "15", "20"];

export default async function Page(
  props: Readonly<{
    searchParams?: Promise<{
      page?: string;
      size?: string;
      query?: string;
    }>;
  }>
) {
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) >= 0 ? Number(searchParams?.page) : 0;
  const size = pageSizes.includes(String(searchParams?.size))
    ? String(searchParams?.size)
    : "15";

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", String(page));
  urlSearchParams.append("size", String(size));
  urlSearchParams.append("query", searchParams?.query ?? "");

  console.log(urlSearchParams.toString());

  const res = await getPublished(urlSearchParams.toString());
  const data = res.data as PublishedPage;

  return (
    <NotificationProviderWrapper>
      <PublishedList data={data} />
    </NotificationProviderWrapper>
  );
}
