import { AppUser } from "./app-types";

export type AppUserPage = {
  content: AppUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
