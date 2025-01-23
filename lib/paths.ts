export const appPathsMap: Record<string, string> = {
  "users": "Users",
  "external-users": "External Users",
  "hua-users": "Hua Users",
};

const adminPaths = new RegExp("^/(users|external-users|hua-users)(?:/.*)?$");

export function isAdminPath(pathname: string): boolean {
  return adminPaths.test(pathname);
}
