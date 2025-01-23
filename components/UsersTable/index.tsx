"use client";

import HeaderCell from "../Tables/HeaderCell";
import {
  AppUserPage,
  ExternalUserPage,
  HuaUserPage,
} from "@/types/response-types";

import { getKeys } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { ViewExternalUserModal } from "../Modals/ViewExternalUserModal";
import { ViewExternalUserModalRef } from "@/types/app-types";
import { useEffect, useRef } from "react";
import TableContainer from "../Tables/TableContainer";
import Table from "../Tables";
import TableBody from "../Tables/Body";
import Row from "./Row";

export default function UsersTable({
  usersPage,
  path,
}: Readonly<{
  usersPage: AppUserPage | ExternalUserPage | HuaUserPage;
  path: string;
}>) {
  const viewExternalUserModalRef = useRef<ViewExternalUserModalRef>(null);

  useEffect(() => {
    if (usersPage.content.length > 0) {
      switch (path) {
        case "users":
          const ids = usersPage.content.map((user) => user.id);
          localStorage.setItem("ids", JSON.stringify(ids));
          break;
        case "external-users":
          const usernames = usersPage.content.map((user) => user.username);
          localStorage.setItem("external-usernames", JSON.stringify(usernames));
          break;
        case "hua-users":
          const hua_ids = usersPage.content.map((user) => user.id);
          localStorage.setItem("hua-ids", JSON.stringify(hua_ids));
      }
    }
  }, [path, usersPage.content]);

  if (usersPage.content.length === 0) {
    return <h2 className="pl-1 pt-2">No results found.</h2>;
  }

  const users = usersPage.content;
  const { size, number, totalElements, totalPages } = usersPage.page;
  const headers = getKeys(users[0]);

  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            {headers.map((header) => (
              <HeaderCell key={header} header={header} />
            ))}
            <th className="sticky right-0 z-50 bg-neutral-200 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap">
              ACTIONS
            </th>
          </tr>
        </thead>

        <TableBody>
          {users.map((user) => (
            <Row
              user={user}
              headers={headers}
              path={path}
              viewExternalUserModalRef={viewExternalUserModalRef}
              key={user.username}
            />
          ))}
        </TableBody>
      </Table>

      <Pagination
        size={size}
        number={number}
        totalElements={totalElements}
        totalPages={totalPages}
        path={path}
      />

      {path === "external-users" ? (
        <ViewExternalUserModal ref={viewExternalUserModalRef} />
      ) : null}
    </TableContainer>
  );
}
