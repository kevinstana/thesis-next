"use client";

import { createExternalUser } from "@/app/external-users/actions";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/providers/NotificationProvider";
import { CreateExternalUser } from "@/types/app-types";
import { ChangeEvent, useCallback, useRef, useState } from "react";

export default function AddExternalUserForm({
  setOpen,
}: {
  setOpen: (value: boolean) => void;
}) {
  const { notify } = useNotification();
  const formRef = useRef<HTMLFormElement>(null);
  const [user, setUser] = useState<CreateExternalUser>();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setUser((prev) => ({ ...prev, [name]: value }));
    },
    [user]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await createExternalUser(user);

    if (String(res.message).includes("created")) {
      notify("success", "User Created.");
      if (formRef.current) {
        formRef.current.reset();
      }
      // setOpen(false);
    }
  }

  return (
    <form
      className="space-y-6 bg-white px-6 py-1"
      ref={formRef}
      onSubmit={handleSubmit}
    >
      <div className="space-y-1">
        <label htmlFor="username" className="block font-medium text-gray-700">
          Username
        </label>
        <input
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
          className="block font-medium text-gray-700"
        >
          Verify Password
        </label>
        <input
          name="verifyPassword"
          type="password"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
          placeholder="Confirm password"
          maxLength={256}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="block font-medium text-gray-700">
          Email
        </label>
        <input
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
        <label htmlFor="firstName" className="block font-medium text-gray-700">
          First Name
        </label>
        <input
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
          name="lastName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
          placeholder="Enter last name"
          maxLength={256}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="role" className="block font-medium text-gray-700">
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

      <Button type="submit">Save</Button>
    </form>
  );
}
