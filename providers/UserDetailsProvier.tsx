import { Role } from "@/types/app-types";
import React, { createContext, useContext, ReactNode } from "react";

interface UserDetailsContextType {
  userId?: string;
  role?: Role;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

function UserDetailsProvider({
  children,
  userId,
  role,
}: {
  children: ReactNode;
  userId?: string;
  role?: Role;
}) {
  return (
    <UserDetailsContext.Provider value={{ userId, role }}>
      {children}
    </UserDetailsContext.Provider>
  );
}

const useUserDetails = (): UserDetailsContextType => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserDetailsProvider");
  }
  return context;
};

export { UserDetailsProvider, useUserDetails };
