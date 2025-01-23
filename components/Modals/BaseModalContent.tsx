import { ReactNode } from "react";

export default function BaseModalContent({
  children,
  className,
}: Readonly<{ children: ReactNode; className: string }>) {
  return <div className={className}>{children}</div>;
}
