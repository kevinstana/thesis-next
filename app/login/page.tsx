import { authenticate } from "./actions";

export default function LoginPage() {
  return (
    <div>
      <form action={authenticate}>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="username">Username</label>
            <input name="username" type="text" placeholder="it5432" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input name="password" type="password" />
          </div>
          <button type="submit">Login</button>
        </div>
      </form>
    </div>
  );
}
