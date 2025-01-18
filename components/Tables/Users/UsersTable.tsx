"use client";

import { AppUser } from "@/types/app-types";
import HeaderCell from "../lib/HeaderCell";
import UserTableBodyCell from "./UserTableBodyCell";
import Pagination from "../lib/Pagination";
import { AppUserPage } from "@/types/response-types";
import { Pencil, SquareArrowOutUpRight } from "lucide-react";

export default function UsersTable({ usersPage }: { usersPage: AppUserPage }) {
  if (usersPage.content.length === 0) {
    return null;
  }

  const users = usersPage.content;
  const { size, number, totalElements, totalPages } = usersPage.page;
  const headers = Object.keys(users[0]);

  return (
    <div className="flex flex-1">
      <div className="overflow-hidden bg-dark-bg-secondary rounded-lg border border-dark-border mx-auto max-w-full lg:w-[80vw]">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-dark-border">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <HeaderCell key={header} header={header} />
                ))}
                <th className="sticky right-0 z-50 bg-neutral-200 px-6 py-3 text-center text-xs font-medium text-dark-text-secondary uppercase tracking-wider whitespace-nowrap">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map((user) => (
                <tr
                  key={user.username}
                  className="hover:bg-dark-bg-tertiary transition-colors"
                >
                  {headers.map((header, index) => (
                    <UserTableBodyCell
                      key={header}
                      header={header}
                      cellValue={user[header as keyof AppUser]}
                    />
                  ))}
                  <td className="sticky right-0 z-50  flex items-center justify-center bg-neutral-100 px-6 py-4">
                    <div className="flex items-center justify-center gap-[1.25rem]">
                    <button>
                      <Pencil size={18} strokeWidth={1.5} />
                    </button>
                    <button>
                      <SquareArrowOutUpRight size={18} strokeWidth={1.5}/>
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          size={size}
          number={number}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
