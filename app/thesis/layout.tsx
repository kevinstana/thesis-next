import { auth } from "@/auth";
import Header from "@/components/Header";
import Sidebar from "@/components/SideBar";

export default async function ThesisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <div>
      {session?.accessToken ? (
        <>
          <Header />
          <div className="flex flex-row h-[calc(100vh-32px)] mt-[32px] bg-neutral-400">
            <Sidebar />
            <div className="overflow-auto">{children}</div>
          </div>
        </>
      ) : null}
    </div>
  );
}
