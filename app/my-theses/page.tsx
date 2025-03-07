import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import ThesesTableOptions from "@/components/ThesesTable/Options";
import getSession from "@/lib/getSession";
import { getTheses } from "./actions";
import { BasicThesisPage } from "@/types/response-types";
import ThesesTable from "@/components/ThesesTable";
import { Role } from "@/types/app-types";

const pageSizes: string[] = ["5", "10", "15", "20", "ALL"];

export default async function ThesesPage(
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

    const res = await getTheses(urlSearchParams.toString());
    const data = res.data as BasicThesisPage;

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
          <ThesesTableOptions path="my-theses" role={role} />
          <ThesesTable thesisPage={data} path="my-theses" />
      </NotificationProviderWrapper>
    </div>
  );
}
