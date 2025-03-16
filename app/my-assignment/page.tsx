import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import MyAssignment from "@/components/MyAssignment";
import getSession from "@/lib/getSession";
import { authFetch } from "@/lib/server-actions";
import { DetailedThesisResponse } from "@/types/app-types";

export default async function MyAssignmentPage() {
  const session = await getSession();
  const role = session?.user?.role;
  const userId = session?.user?.id;

  const { data, status } = await authFetch(
    "theses/my-assignment",
    "GET",
    null,
    null,
    "myAssignment"
  );

  if (status !== 200) {
    return <div>No assignment found</div>;
  }

  return (
    <NotificationProviderWrapper>
      <UserDetailsProviderWrapper role={role} userId={userId}>
        <MyAssignment data={data as DetailedThesisResponse} />
      </UserDetailsProviderWrapper>
    </NotificationProviderWrapper>
  );
}
