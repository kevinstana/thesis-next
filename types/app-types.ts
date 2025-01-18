export type Role = "ADMIN" | "STUDENT" | "PROFESSOR" | "SECRETARY";

export type SidebarMenuType = {
  path: string;
  name: string;
  icon?: JSX.Element;
};

export type AppUser = {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  createdAt: number
  lastModified?: number
  lastModifiedBy?: string
  role: Role
  enabled: boolean
}