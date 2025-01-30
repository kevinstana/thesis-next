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

export type TransformedUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastModified?: string;
  lastModifiedBy?: string;
  role: Role;
  isEnabled: boolean;
}

export type TransformedUserPage ={
  content: TransformedUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type AddExternalUserModalRef = {
  openDialog: () => void
}

export type UserProfileModalRef = {
  openDialog: (username: string) => void
}

export type IconProps = {
  className?: string
}

export type CreateExternalUser = {
  username?: string
  password?: string
  verifyPassword?: string
  email?: string
  firstName?: string
  lastName?: string
  role?: Role
}

export type CreateExternalUserErrors = {
  username?: string
  password?: string
  email?: string
}
