import { Role, SidebarMenuType } from "@/types/app-types";
import {
  // Home,
  Users,
  UserRound,
  GraduationCap,
  ScrollText,
  ClipboardCheck,
  ClipboardList,
  ClipboardPen,
  MonitorCog,
} from "lucide-react";

const baseStyle = "ml-1 mr-6";
const iconSize = 21;

export const sharedMenuItems = [
  // {
  //   path: "/",
  //   name: "Home",
  //   icon: <Home size={iconSize} className={baseStyle} />,
  // },
  {
    path: "/theses",
    name: "Theses",
    icon: <ScrollText size={iconSize} className={baseStyle} />,
  },
];

export const roleSpecificMenuItems: Record<Role, SidebarMenuType[]> = {
  ADMIN: [
    {
      path: "/users",
      name: "All Users",
      icon: <Users size={iconSize} className={baseStyle} />,
    },
    {
      path: "/external-users",
      name: "External Users",
      icon: <UserRound size={iconSize} className={baseStyle} />,
    },
    {
      path: "/hua-users",
      name: "HUA Users",
      icon: <GraduationCap size={iconSize} className={baseStyle} />,
    },
  ],
  STUDENT: [
    {
      path: "/my-assignment",
      name: "My assignment",
      icon: <ClipboardCheck size={iconSize} className={baseStyle} />,
    },
  ],
  PROFESSOR: [
    {
      path: "/my-theses",
      name: "My Theses",
      icon: <ClipboardPen size={iconSize} className={baseStyle} />,
    },
    {
      path: "/assigned-reviews",
      name: "Assigned Reviews",
      icon: <ClipboardList size={iconSize} className={baseStyle} />,
    },
  ],
  SECRETARY: [
    {
      path: "/actions",
      name: "Actions",
      icon: <MonitorCog size={iconSize} className={baseStyle} />,
    },
  ],
};
