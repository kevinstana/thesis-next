import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1>Hello from home page</h1>
        <span>{session?.username}</span>
        <span>{session?.email}</span>
        <span>{session?.name}</span>
        <span>{session?.accessToken}</span>
        <span>{session?.refreshToken}</span>
      </main>

      <form
        action={async () => {
          "use server";
          await signOut({ redirect: true, redirectTo: "/login" });
        }}
      >
        <button type="submit">Logout</button>
      </form>
    </div>
  );
}
