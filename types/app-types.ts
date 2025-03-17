export type Role = "ADMIN" | "STUDENT" | "PROFESSOR" | "SECRETARY";
export const availableRoles: Role[] = [
  "STUDENT",
  "PROFESSOR",
  "SECRETARY",
  "ADMIN",
];

export const availableStatuses: string[] = [
  "AVAILABLE",
  "IN_PROGRESS",
  "PENDING_REVIEW",
  "REVIEWED",
  // "PUBLISHED",
];

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
};

export type TransformedUserPage = {
  content: TransformedUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type AddExternalUserModalRef = {
  openDialog: () => void;
};

export type CreateThesisModalRef = {
  openDialog: () => void;
};

export type UserProfileModalRef = {
  openDialog: (username: string) => void;
};

export type TasksModalRef = {
  openDialog: (id: string, title: string) => void;
};

export type ViewThesisModalRef = {
  openDialog: (id: string) => void;
};

export type ThesisRequestsModalRef = {
  openDialog: (id: string, title: string) => void;
};

export type GeneralViewThesisModalRef = {
  openDialog: (id: string) => void;
};

export type ApplyForThesisModalRef = {
  openDialog: (id: string, title: string, professorName: string) => void;
};

export type IconProps = {
  className?: string;
};

export type CreateExternalUser = {
  username?: string;
  password?: string;
  verifyPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: Role;
};

export type CreateExternalUserErrors = {
  username?: string;
  password?: string;
  email?: string;
};

export type CreateThesisErrors = {
  title?: string;
};

export type Course = {
  id: number;
  name: string;
  url: string;
};

export type BasicThesis = {
  id: string;
  title: string;
  createdAt: string;
  lastModified: string;
  professorFullName: string;
  status: string;
};

export type DetailedThesis = {
  id: string;
  title: string;
  description: string;

  professorId: number;
  professorFirstName: string;
  professorLastName: string;

  reviewer1Id: number;
  reviewer1FirstName: string;
  reviewer1LastName: string;

  reviewer2Id: number;
  reviewer2FirstName: string;
  reviewer2LastName: string;

  studentId: number | null;
  studentFirstName: string | null;
  studentLastName: string | null;

  status: string;
};

export type DetailedThesisResponse = {
  thesis: DetailedThesis;
  recommendedCourses: Course[];
  canMakeRequest: boolean;
  hasMadeRequest: boolean;
};

export type CommitteeMember = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
};

export type CustomAction = {
  name: string;
  action: (...args: unknown[]) => unknown;
};
