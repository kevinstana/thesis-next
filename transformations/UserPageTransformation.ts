import { dateFormatter } from "@/lib/utils";
import { TransformedUser, TransformedUserPage } from "@/types/app-types";
import { UserPage } from "@/types/response-types";

export default function UserPageTransformation(userPage : UserPage): TransformedUserPage {
  const transformedUsers: TransformedUser[] = userPage.content.map((user) => ({
    ...user,
    createdAt: dateFormatter(String(user.createdAt)),
    lastModified: dateFormatter(String(user.lastModified)),
  }));

  return {
    ...userPage,
    content: transformedUsers,
  };
}
