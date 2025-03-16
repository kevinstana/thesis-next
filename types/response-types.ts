import { AppUser, BasicThesis } from "./app-types";

export type UserPage = {
  content: AppUser[];
  page: Page;
};

export type BasicThesisPage = {
  content: BasicThesis[];
  page: Page;
};

export type ThesisRequest = {
  id: number;
  thesisId: number;
  studentId: number;
  studentUsername: number;
  studentFirstName: string;
  studentLastName: string;
  description: string;
  pdf: string;
  pdfSize: number;
  status: string;
  createdAt: string;
};

export type ThesisRequestsPage = {
  content: ThesisRequest[];
  page: Page;
};

export type Page = {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  thesisId: number;
  createdAt: string;
  priority: string;
  status: string;
};

export type TaskFile = {
  fileName: string,
  fileSize: number
}

export type DetailedTask = {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  files: TaskFile[]
}

export type TaskPage = {
  content: DetailedTask[];
  page: Page;
};
