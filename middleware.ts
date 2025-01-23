export { auth as default } from "@/auth";

export const config = {
  matcher: ["/((?!logout|_next/static|_next/image|icon.ico).*)", "/"],
};
