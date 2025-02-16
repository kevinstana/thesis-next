import { Button } from "@/components/ui/button";
import getSession from "@/lib/getSession";
import { Plus } from "lucide-react";

export default async function MyThesesPage() {
  const session = await getSession();

  return (
    <div>
      <Button className="border rounded-lg max-w-fit pr-6 h-[2.625rem]">
        <Plus />
        <span>Create</span>
      </Button>
      <p>Hello from my theses page</p>
      <p>Your role is: {session?.user?.role}</p>
    </div>
  );
}
