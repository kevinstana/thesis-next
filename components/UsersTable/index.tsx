"use client";

import HeaderCell from "../Tables/HeaderCell";
import {
  AppUserPage,
  ExternalUserPage,
  HuaUserPage,
} from "@/types/response-types";

import { getKeys } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import { UserProfileModal } from "../Modals/UserProfileModal";
import { UserProfileModalRef } from "@/types/app-types";
import { useEffect, useRef, useState } from "react";
import TableContainer from "../Tables/TableContainer";
import Table from "../Tables";
import TableBody from "../Tables/Body";
import Row from "./Row";
import { UserDetailsProvider } from "@/providers/UserIdentifiersProvider";

export default function UsersTable({
  usersPage,
  path,
}: Readonly<{
  usersPage: AppUserPage | ExternalUserPage | HuaUserPage;
  path: string;
}>) {
  const [identifiers, setIdentifiers] = useState<string[]>([]);
  const userProfileModalRef = useRef<UserProfileModalRef>(null);

  useEffect(() => {
    if (usersPage.content.length > 0) {
      setIdentifiers(usersPage.content.map((user) => user.username));
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
            <th className="sticky top-0 right-0 z-[51] bg-neutral-200 px-4 py-3 text-center text-xs font-medium uppercase tracking-wider whitespace-nowrap">
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
              userProfileModalRef={userProfileModalRef}
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

      <UserDetailsProvider identifiers={identifiers} path={path}>
        <UserProfileModal ref={userProfileModalRef} />
      </UserDetailsProvider>
    </TableContainer>
  );
}
