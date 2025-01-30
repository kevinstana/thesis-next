import { AppUser } from "./app-types";

export type UserPage = {
  content: AppUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
