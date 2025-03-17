"use client";

import HeaderCell from "../Tables/HeaderCell";

import { getKeys } from "@/lib/utils";
import Pagination from "@/components/Pagination";
import {
  BasicThesis,
  GeneralViewThesisModalRef,
  ThesisRequestsModalRef,
  ViewThesisModalRef,
} from "@/types/app-types";
import { useEffect, useRef, useState } from "react";
import TableContainer from "../Tables/TableContainer";
import Table from "../Tables";
import TableBody from "../Tables/Body";
import { BasicThesisPage } from "@/types/response-types";
import Row from "./Row";
import { ThesisIdentifiersProvider } from "@/providers/ThesisIdentifiersProvider";
import { GeneralViewThesisModal } from "../Modals/ViewThesis/General";
import { ViewThesisModal } from "../Modals/ViewThesis/AsProfessor";
import { ThesisRequestsModal } from "../Modals/ThesisRequestsModal";
import { useUserDetails } from "@/providers/UserDetailsProvier";

export default function ThesesTable({
  thesisPage,
  path,
}: Readonly<{
  thesisPage: BasicThesisPage;
  path: string;
}>) {
  const [identifiers, setIdentifiers] = useState<string[]>([]);
  const generalViewThesisModalRef = useRef<GeneralViewThesisModalRef>(null);
  const viewThesisModalRef = useRef<ViewThesisModalRef>(null);
  const thesisRequestsModalRef = useRef<ThesisRequestsModalRef>(null);
  const { role } = useUserDetails();

  useEffect(() => {
    if (thesisPage.content.length > 0) {
      setIdentifiers(thesisPage.content.map((thesis) => thesis.id));
    }
  }, [thesisPage.content]);

  if (thesisPage.content.length === 0) {
    return <h2 className="pl-1 pt-2">No results found.</h2>;
  }

  const theses = thesisPage.content;
  const { size, number, totalElements, totalPages } = thesisPage.page;

  const customHeadersOrder: (keyof BasicThesis)[] = [
    "id",
    "title",
    "professorFullName",
    "createdAt",
    "lastModified",
    "status",
  ];
  const thesisKeys = getKeys(theses[0]);

  const headers = [
    ...customHeadersOrder.filter((header) => thesisKeys.includes(header)),
    ...thesisKeys.filter((key) => !customHeadersOrder.includes(key)),
  ];

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
          {theses.map((thesis) => (
            <Row
              thesis={thesis}
              headers={headers}
              key={thesis.id}
              viewThesisModalRef={
                path === "theses" && role === "SECRETARY"
                  ? generalViewThesisModalRef // replace with secretary modal
                  : path === "theses"
                  ? generalViewThesisModalRef
                  : viewThesisModalRef
              }
              thesisRequestsModalRef={
                path === "my-theses" ? thesisRequestsModalRef : null
              }
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

      <ThesisIdentifiersProvider identifiers={identifiers}>
        <GeneralViewThesisModal ref={generalViewThesisModalRef} />

        {path === "my-theses" ? (
          <>
            <ViewThesisModal ref={viewThesisModalRef} />
            <ThesisRequestsModal ref={thesisRequestsModalRef} />
          </>
        ) : null}
      </ThesisIdentifiersProvider>
    </TableContainer>
  );
}
