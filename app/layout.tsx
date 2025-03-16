import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import getSession from "@/lib/getSession";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <div className="flex h-screen">
          {session?.user ? <Sidebar role={session.user?.role} /> : null}
          <div className="flex flex-1 flex-col min-w-0">
            {session?.user ? <Header /> : null}
            <main className="flex-1 overflow-hidden py-10 px-10">
              <div className="w-full">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
