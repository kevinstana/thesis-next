import React, { createContext, useContext, ReactNode } from "react";

interface ThesisIdentifiersContextType {
  identifiers: string[];
}

const ThesisIdentifiersContext = createContext<
  ThesisIdentifiersContextType | undefined
>(undefined);

function ThesisIdentifiersProvider({
  children,
  identifiers,
}: {
  children: ReactNode;
  identifiers: string[];
}) {
  return (
    <ThesisIdentifiersContext.Provider value={{ identifiers }}>
      {children}
    </ThesisIdentifiersContext.Provider>
  );
}

const useThesisIdentifiers = (): ThesisIdentifiersContextType => {
  const context = useContext(ThesisIdentifiersContext);
  if (!context) {
    throw new Error(
      "useThesisIdentifiers must be used within a ThesisIdentifiersProvider"
    );
  }
  return context;
};

export { ThesisIdentifiersProvider, useThesisIdentifiers };
