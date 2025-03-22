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
  fileName: string;
  fileSize: number;
};

export type DetailedTask = {
  id: number;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdAt: string;
  files: TaskFile[];
};

export type TaskPage = {
  content: DetailedTask[];
  page: Page;
};

export type Published = {
  id: number;
  title: string;
  description: string;
  professorId: number;
  professorFirstName: string;
  professorLastName: string;
  professorGrade: number;
  reviewer1Id: number;
  reviewer1FirstName: string;
  reviewer1LastName: string;
  reviewer1Grade: number;
  reviewer2Id: number;
  reviewer2FirstName: string;
  reviewer2LastName: string;
  reviewer2Grade: number;
  studentId: number;
  studentFirstName: string;
  studentLastName: string;
  status: string;
  publishedAt: string;
  fileName: string;
  fileSize: number;
};

export type PublishedPage = {
  content: Published[];
  page: Page;
};
