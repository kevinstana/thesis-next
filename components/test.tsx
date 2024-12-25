import { signOut } from "@/auth";

export default function Signout() {
  return (
    <div>
      <form
        action={async () => {
          "use server";
          await signOut({ redirect: true, redirectTo: "/login" });
        }}
      >
        <button type="submit">sign out</button>
      </form>
    </div>
  );
}
