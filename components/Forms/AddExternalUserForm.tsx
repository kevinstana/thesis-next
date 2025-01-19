import { Button } from "@/components/ui/button";

export default function AddExternalUserForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="ml-2">
          Username
        </label>
        <input
          name="username"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="Username"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="ml-2">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="Password"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="verify-password" className="ml-2">
          Verify Password
        </label>
        <input
          name="verify-password"
          type="password"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="Verify Password"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="ml-2">
          Email
        </label>
        <input
          name="email"
          type="email"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="Email"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="firstName" className="ml-2">
          First Name
        </label>
        <input
          name="firstName"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="First Name"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="Last Name" className="ml-2">
          Last Name
        </label>
        <input
          name="lastName"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          placeholder="Last Name"
          maxLength={256}
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="role" className="ml-2">
          Role
        </label>
        <select
          name="role"
          className="w-full px-4 py-3 text-[17px] text-gray-900 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 transition-shadow"
          required
        >
          <option value="" disabled selected>
            Select a role
          </option>
          <option value="ADMIN">Admin</option>
          <option value="STUDENT">Student</option>
          <option value="PROFESSOR">Professor</option>
          <option value="SECRETARY">Secretary</option>
        </select>
      </div>

      <Button type="submit" onClick={() => alert("you clicked save")}>
        Save
      </Button>
    </form>
  );
}
