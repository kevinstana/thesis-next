"use client";

import { AppUser } from "@/types/app-types";
import HeaderCell from "../lib/HeaderCell";
import UserTableBodyCell from "./UserTableBodyCell";
import Pagination from "../lib/Pagination";
import {
  AppUserPage,
  ExternalUserPage,
  HuaUserPage,
} from "@/types/response-types";
import { Pencil, SquareArrowOutUpRight } from "lucide-react";
import SharedTableAndPaginationContainer from "../SharedTable/SharedTableAndPaginationContainer";
import SharedTable from "../SharedTable";
import SharedTableHeader from "../SharedTable/SharedTableHeader";
import SharedTableBody from "../SharedTable/SharedTableBody";
import { getKeys } from "@/lib/utils";

export default function UsersTable({
  usersPage,
  path,
}: {
  usersPage: AppUserPage | ExternalUserPage | HuaUserPage;
  path: string;
}) {
  if (usersPage.content.length === 0) {
    return <h2 className="pl-1 pt-2">No results found.</h2>;
  }

  const users = usersPage.content;
  const { size, number, totalElements, totalPages } = usersPage.page;
  const headers = getKeys(users[0]);

  return (
    <SharedTableAndPaginationContainer>
      <SharedTable>
        <SharedTableHeader>
          <tr>
            {headers.map((header) => (
              <HeaderCell key={header} header={header} />
            ))}
            <th className="sticky right-0 z-50 bg-neutral-200 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap">
              ACTIONS
            </th>
          </tr>
        </SharedTableHeader>

        <SharedTableBody>
          {users.map((user) => (
            <tr key={user.username}>
              {headers.map((header) => (
                <UserTableBodyCell
                  key={header}
                  header={header}
                  cellValue={user[header]}
                />
              ))}
              <td className="sticky right-0 z-50 flex items-center justify-center bg-neutral-100 px-6 py-4 h-[3.25rem]">
                <div className="flex items-center justify-center gap-[1.25rem]">
                  <button>
                    <Pencil size={18} strokeWidth={1.5} />
                  </button>
                  <button>
                    <SquareArrowOutUpRight size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </SharedTableBody>
      </SharedTable>

      <Pagination
        size={size}
        number={number}
        totalElements={totalElements}
        totalPages={totalPages}
        path={path}
      />
    </SharedTableAndPaginationContainer>
  );
}
