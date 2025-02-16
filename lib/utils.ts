import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { availableRoles, Role } from "@/types/app-types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function dateFormatter(value: string): string {
  const date = new Date(String(value));

  const formatter = new Intl.DateTimeFormat("el-GR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // hourCycle: "h23",
  });

  const formatterDate = formatter.format(date);

  return formatterDate;
}

export function formatFromCamelCase(header: string): string {
  const words = header.split(/(?=[A-Z])/);
  const formattedHeader = words.join(" ");

  return formattedHeader;
}

export function getKeys<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function isValidRole(role: string): role is Role {
  return availableRoles.includes(role as Role);
}
