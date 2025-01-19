import { AppUser, ExternalUser, HuaUser } from "./app-types";

export type AppUserPage = {
  content: AppUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type ExternalUserPage = {
  content: ExternalUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};

export type HuaUserPage = {
  content: HuaUser[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
};
