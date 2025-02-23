import React, { createContext, useContext, ReactNode } from "react";

interface UserIdentifiersContextType {
  identifiers: string[];
  path: string;
}

const UserIdentifiersContext = createContext<UserIdentifiersContextType | undefined>(undefined);

function UserIdentifiersProvider({
  children,
  identifiers,
  path,
}: {
  children: ReactNode;
  identifiers: string[];
  path: string;
}) {
  return (
    <UserIdentifiersContext.Provider value={{ identifiers, path }}>
      {children}
    </UserIdentifiersContext.Provider>
  );
}

const useUserIdentifiers = (): UserIdentifiersContextType => {
  const context = useContext(UserIdentifiersContext);
  if (!context) {
    throw new Error("useUserIdentifiers must be used within a UserIdentifiers");
  }
  return context;
};

export { UserIdentifiersProvider, useUserIdentifiers };
