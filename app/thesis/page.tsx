import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
// import { customLogout } from "../logout/actions";
// import { redirect } from "next/navigation";
import Balls from "./clientbutton";
import { test } from "./actions";

export default async function ThesisPage() {
  const session = await auth();

  return (
    <div className="m-40">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your dashboard. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            // icon: DollarSign,
            value: "$45,231.89",
            change: "+20.1%",
          },
          {
            title: "Active Users",
            // icon: Users,
            value: "2,350",
            change: "+180.1%",
          },
          {
            title: "Active Sessions",
            // icon: Activity,
            value: "1,247",
            change: "+19%",
          },
          {
            title: "Conversion Rate",
            // icon: BarChart,
            value: "12.5%",
            change: "+4.75%",
          },
        ].map((item) => (
          <Card key={item.title} className="p-6">
            <div className="flex items-center space-x-4">
              {/* <item.icon className="h-6 w-6 text-muted-foreground" /> */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </p>
                <h3 className="text-2xl font-bold">{item.value}</h3>
                <p className="text-xs text-green-500">
                  {item.change} from last month
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <span className="block w-[200px]">{session?.name}</span>
      <span className="block w-[200px]">{session?.username}</span>
      <span className="block w-[200px]">{session?.email}</span>
      <span className="block w-[200px] break-words">
        {session?.accessToken}
      </span>
      <span className="block w-[200px] break-words">
        {session?.refreshToken}
      </span>

      {/* Sample sections to test scrolling */}
      {Array.from({ length: 5 }).map((_, i) => (
        <section key={i} className="space-y-6">
          <h2 className="text-2xl font-bold">Section {i + 1}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, j) => (
              <Card key={j} className="p-6">
                <h3 className="text-lg font-semibold mb-2">Card {j + 1}</h3>
                <p className="text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris.
                </p>
                <Button>Learn More</Button>
              </Card>
            ))}
          </div>
        </section>
      ))}
      {/* <form action={customLogout}>
      <button type="button" onClick={() => redirect('/logout')}>Logout</button>
      </form> */}

      <form action={test}>
        <button type="submit">test</button>
      </form>

      <Balls />
    </div>
  );
}
