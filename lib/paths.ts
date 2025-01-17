const adminPaths = new RegExp("^/users(?:/.*)?$");
// const teacherPaths = new RegExp("^/theses/new$");

export function isAdminPath(pathname: string): boolean {
    return adminPaths.test(pathname)
}