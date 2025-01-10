export { auth as default } from "@/auth";

export const config = {
  matcher: ["/((?!login|logout|_next/static|_next/image|favicon.ico).*)"],
};
