import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import React from "react";
import { usePathname } from "next/navigation";

const validPaths = ["/", "/users"];

export default function Breadcrumbs() {
  const pathname = usePathname();

  if (!validPaths.includes(pathname)) {
    return null;
  }

  const pages = pathname.split("/");

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList className="text-black dark:text-white">
          <Link href="/">Hua Thesis</Link>
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              {page && (
                <>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href={"/" + page}>{page}</BreadcrumbLink>
                  </BreadcrumbItem>
                </>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
}
