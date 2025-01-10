"use client";

import { useSearchParams } from "next/navigation";

// const formattedError = {
//   invalidCredentials: "Invalid credentials",
//   unknownError: "Something went wrong. Please try again later",
// };

function setErrorMessage(error: string | null) {
  switch (error) {
    case "Invalid_credentials":
      return "Invalid Credentials";
    case "something_went_wrong":
      return "Something went wrong";
    case "password_mismatch":
      return "Passwords don't match";
    case "email_exists":
      return "Email exists";
    case "weak_password":
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    case "invalid_regNo":
      return "Registration Number must be a positive integer";
    default:
      return "";
  }
}

export default function ErrorMessage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = setErrorMessage(error);

  return (
    <span className="w-full pt-2 block text-center text-sm text-rose-600">
      {errorMessage}
    </span>
  );
}
