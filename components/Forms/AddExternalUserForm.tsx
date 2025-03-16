"use client";

import { createExternalUser } from "@/app/external-users/actions";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/providers/NotificationProvider";
import {
  CreateExternalUser,
  CreateExternalUserErrors,
} from "@/types/app-types";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import { CircleAlert, Loader2 } from "lucide-react";

export default function AddExternalUserForm({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
  const { notify } = useNotification();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, setPending] = useState<boolean>(false);
  const [user, setUser] = useState<CreateExternalUser>();
  const [erros, setErrors] = useState<CreateExternalUserErrors>();
  const initialErrors = { username: "", password: "", email: "" };

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setUser((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPending(true);

    if (user?.password !== user?.verifyPassword) {
      setPending(false);
      setErrors({ ...initialErrors, password: "Password mismatch" });
      return;
    }

    const res = await createExternalUser(user);
    if (res.status === 201) {
      setPending(false);
      notify("success", "User Created.");
      setErrors(initialErrors);
      formRef.current?.reset();
      setOpen(false)
      return;
    }

    if (res.error) {
      switch (res.error) {
        case "Username already in use":
          setErrors({ ...initialErrors, username: res.error });
          break;
        case "Email already in use":
          setErrors({ ...initialErrors, email: res.error });
          break;
        default:
          setErrors(initialErrors);
      }
      setPending(false);
    }
  }

  return (
    <div
      className="flex flex-col flex-grow justify-between p-4 overflow-auto"
      tabIndex={-1}
    >
      <form
        className="space-y-6 bg-white px-6 py-1"
        ref={formRef}
        onSubmit={handleSubmit}
      >
        <div className="space-y-1">
          <label
            htmlFor="username"
            className="flex gap-3 font-medium text-gray-700"
          >
            Username
            <>
              {erros?.username ? (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <CircleAlert size={13} /> {erros.username}
                </span>
              ) : null}
            </>
          </label>
          <input
            id="username"
            name="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Enter username"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Enter password"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="verifyPassword"
            className="flex gap-3 font-medium text-gray-700"
          >
            Verify Password
            <>
              {erros?.password ? (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <CircleAlert size={13} /> {erros.password}
                </span>
              ) : null}
            </>
          </label>
          <input
            id="verifyPassword"
            name="verifyPassword"
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Verify password"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="email"
            className="flex gap-3 font-medium text-gray-700"
          >
            Email
            <>
              {erros?.email ? (
                <span className="flex items-center gap-1 text-sm text-red-500">
                  <CircleAlert size={13} /> {erros.email}
                </span>
              ) : null}
            </>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Enter email"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="firstName"
            className="block font-medium text-gray-700"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Enter first name"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="lastName" className="block font-medium text-gray-700">
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            placeholder="Enter last name"
            maxLength={256}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1">
          <label
            htmlFor="create-external-role-select"
            className="block font-medium text-gray-700"
          >
            Role
          </label>
          <select
            id="create-external-role-select"
            name="role"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
            onChange={handleChange}
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select a role
            </option>
            <option value="ADMIN">Admin</option>
            <option value="STUDENT">Student</option>
            <option value="PROFESSOR">Professor</option>
            <option value="SECRETARY">Secretary</option>
          </select>
        </div>

        <div className="flex gap-2 justify-end">
          <Button type="submit" disabled={pending}>
            {pending ? (
              <div className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </div>
            ) : (
              "Save"
            )}
          </Button>
          <Button
            type="button"
            className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
