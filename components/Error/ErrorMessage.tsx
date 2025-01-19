"use client";

import { useSearchParams } from "next/navigation";

function setErrorMessage(error: string | null) {
  switch (error) {
    case "invalid_credentials":
      return "Invalid Credentials";
    case "something_went_wrong":
      return "Something went wrong";
    case "access_denied":
      return "Access denied. Please contact your system administrator.";
    case "account_disabled":
      return "Account disabled. Please contact your system administrator.";
    default:
      return "";
  }
}

export default function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = setErrorMessage(error);

  if (!errorMessage) {
    return null;
  }

  return (
    <div className="px-3 py-2 rounded-lg bg-red-50 border border-red-100">
      <p className="text-[15px] text-red-600">{errorMessage}</p>
    </div>
  );
}
