// import { authenticate } from "@/app/login/actions";
// import { Button } from "../ui/button";
// import { Input } from "../ui/input";
// import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
// import ErrorMessage from "../Errors/ErrorMessage";
// import { Label } from "../ui/label";
// import { Checkbox } from "../ui/checkbox";

export default function LoginForm() {
  return (
    <>
    {/* <Card className="w-[18vw] dark:bg-dark-1 dark:border-custom-gray-1">
      <CardHeader>
        <CardTitle className="flex justify-center">Login</CardTitle>
      </CardHeader>
      <CardContent>
        <ErrorMessage />
        <form action={authenticate}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="it12345"
                className="dark:bg-dark-1 dark:border-custom-gray-1 dark:text-white dark:placeholder-custom-placeholder-gray-1"
                required
                />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="dark:bg-dark-1 dark:border-custom-gray-1 dark:text-white dark:placeholder-custom-placeholder-gray-1"
                required
                />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="isExternal" name="isExternal" value={"true"} />
              <Label
                htmlFor="isExternal"
                className="text-sm text-neutral-600"
                >
                Exteral User
              </Label>
            </div>

            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card> */}


<div className="w-full max-w-[320px] space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-[32px] font-medium text-gray-900 tracking-tight">
            Sign in
          </h1>
          <p className="mt-2 text-[17px] text-gray-500">
            Access your account
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <input
              type="email"
              className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex items-center">
            <input
              id="external-user"
              type="checkbox"
              className="h-5 w-5 rounded-md border-gray-300 text-gray-900 focus:ring-gray-900"
            />
            <label htmlFor="external-user" className="ml-2 text-[15px] text-gray-900">
              External User
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-gray-900 text-white rounded-xl px-4 py-3 text-[17px] font-medium hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </form>

        {/* Footer links */}
        <div className="pt-4 text-center">
          <a href="#" className="text-[15px] text-gray-900 hover:underline">
            Forgot password?
          </a>
          <div className="mt-4 text-[15px] text-gray-500">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-gray-900 hover:underline">
              Create one
            </a>
          </div>
        </div>
      </div>

                  </>
);
}
