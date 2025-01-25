import { authenticate } from "@/app/login/actions";
import ErrorMessage from "../Error/ErrorMessage";
import LoginButton from "../Buttons/LoginButton";

export default function LoginForm() {
  return (
    <div className="w-full max-w-[320px] space-y-8">
      <div className="text-center">
        <h1 className="text-[32px] font-medium text-gray-900 tracking-tight">
          Sign in
        </h1>
        <p className="mt-2 text-[17px] text-gray-500">Access your account</p>
      </div>

      <form className="space-y-4" action={authenticate}>
        <ErrorMessage />
        <div>
          <input
            name="username"
            className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
            placeholder="Username"
            maxLength={256}
            required
          />
        </div>

        <div>
          <input
            name="password"
            type="password"
            className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
            placeholder="Password"
            maxLength={256}
            required
          />
        </div>

        <div className="flex items-center">
          <input
            id="isExternal"
            name="isExternal"
            type="checkbox"
            value={"isExternal"}
            className="h-5 w-5 rounded-lg border-gray-300 text-gray-800 focus:ring-1 focus:ring-gray-900 focus:ring-offset-0 checked:bg-gray-900 checked:hover:bg-gray-800 transition-colors cursor-pointer"
          />
          <label
            htmlFor="isExternal"
            className="ml-2 text-[15px] text-gray-900"
          >
            External User
          </label>
        </div>

        <LoginButton />
      </form>

      <div className="h-[6.9375rem]" />
      {/* <div className="pt-4 text-center">
        <a href="#" className="text-[15px] text-gray-900 hover:underline">
          Forgot password?
        </a>
        <div className="mt-4 text-[15px] text-gray-500">
          Need any help? Click here for{" "}
          <a href="#" className="text-gray-900 hover:underline">
            support.
          </a>
        </div>
      </div> */}
    </div>
  );
}
