import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/SideBar";
import Header from "@/components/Header";
import { auth } from "@/auth";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`h-screen overflow-hidden ${inter.className} antialiased`}
      >
        <div className="flex h-screen">
          {session?.user ? <Sidebar role={session.user?.role} /> : null}
          <div className="flex-1 flex flex-col">
            {session?.user ? <Header /> : null}
            <main className="flex flex-col flex-1 overflow-auto py-20 px-16">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
