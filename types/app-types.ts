export type Role = "ADMIN" | "STUDENT" | "PROFESSOR" | "SECRETARY";
export const availableRoles: Role[] = ["STUDENT", "PROFESSOR", "SECRETARY", "ADMIN"];

export type SidebarMenuType = {
  path: string;
  name: string;
  icon?: JSX.Element;
};

export type AppUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: number;
  lastModified?: number;
  lastModifiedBy?: string;
  role: Role;
  isEnabled: boolean;
};

export type ExternalUser = AppUser;
export type HuaUser = AppUser;

export type AddExternalUserModalRef = {
  openDialog: () => void
}