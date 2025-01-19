import { Role, SidebarMenuType } from "@/types/app-types";
import { Home, Users, UserRound, GraduationCap } from "lucide-react";

export const sharedMenuItems = [
  { path: "/", name: "Home", icon: <Home size={21} className="ml-1 mr-6" /> },
];

export const roleSpecificMenuItems: Record<Role, SidebarMenuType[]> = {
  ADMIN: [
    {
      path: "/users",
      name: "All Users",
      icon: <Users size={21} className="ml-1 mr-6" />,
    },
    {
      path: "/external-users",
      name: "External Users",
      icon: <UserRound size={21} className="ml-1 mr-6" />,
    },
    {
      path: "/hua-users",
      name: "HUA Users",
      icon: <GraduationCap size={21} className="ml-1 mr-6" />,
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
