import { AppUser, BasicThesis } from "./app-types";

export type UserPage = {
  content: AppUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type BasicThesisPage = {
  content: BasicThesis[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}
