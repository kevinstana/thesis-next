const adminPaths = new RegExp("^/users(?:/.*)?$");

export function isAdminPath(pathname: string): boolean {
    return adminPaths.test(pathname)
}