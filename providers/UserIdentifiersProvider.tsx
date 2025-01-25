import React, { createContext, useContext, ReactNode } from "react";

interface UserDetailsContextType {
  identifiers: string[];
  path: string;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

function UserDetailsProvider({
  children,
  identifiers,
  path,
}: {
  children: ReactNode;
  identifiers: string[];
  path: string;
}) {
  return (
    <UserDetailsContext.Provider value={{ identifiers, path }}>
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
