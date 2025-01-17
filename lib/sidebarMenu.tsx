import { Role, SidebarMenuType } from "@/types/app-types";
import { Home, Users } from "lucide-react";

export const sharedMenuItems = [
  { path: "/", name: "Home", icon: <Home size={21} className="ml-1 mr-6" /> },
];

export const roleSpecificMenuItems: { [role in Role]: SidebarMenuType[] } = {
  ADMIN: [
    {
      path: "/users",
      name: "Users",
      icon: <Users size={21} className="ml-1 mr-6" />,
    },
  ],
  STUDENT: [
    {
      path: "",
      name: "",
      icon: undefined,
    },
  ],
  PROFESSOR: [
    {
      path: "",
      name: "",
      icon: undefined,
    },
  ],
  SECRETARY: [
    {
      path: "",
      name: "",
      icon: undefined,
    },
  ],
};
