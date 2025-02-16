import NotificationProviderWrapper from "@/components/ClientWrappers/NotificationProviderWrapper";
import UserDetailsProviderWrapper from "@/components/ClientWrappers/UserDetailsProviderWrapper";
import ThesesTableOptions from "@/components/ThesesTable/Options";
import getSession from "@/lib/getSession";

export default async function ThesesPage() {
  const session = await getSession();
  const userId = session?.user?.id;
  const role = session?.user?.role;

  console.log(userId);

  return (
    <div className="flex flex-col gap-2">
      <NotificationProviderWrapper>
        <UserDetailsProviderWrapper userId={userId} role={role}>
          <ThesesTableOptions />
          {/* todo: add table */}
        </UserDetailsProviderWrapper>
      </NotificationProviderWrapper>
    </div>
  );
}
