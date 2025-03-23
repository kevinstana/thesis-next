import { Published } from "@/types/response-types";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Award,
  NotebookPen,
  SquareArrowOutUpRight,
  User,
  Users,
} from "lucide-react";
import { useNotification } from "@/providers/NotificationProvider";
import { authFetch } from "@/lib/server-actions";

function formatDate(timestamp: string) {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Athens",
  };

  // Use Intl.DateTimeFormat to format the date in Athens time
  const dateFormatter = new Intl.DateTimeFormat("el-GR", options);
  return dateFormatter.format(date);
}

function getFinalGrade(a: number, b: number, c: number) {
  const average = (a + b + c) / 3;
  return Math.round(average * 10) / 10;
}

export default function PublishedCard({ thesis }: { thesis: Published }) {
  const { notify } = useNotification();

  async function handleFilePreview() {
    const { data, status } = await authFetch(
      `theses/published/${thesis.id}/${thesis.fileName}`,
      "GET",
      null,
      null
    );

    if (status === 200) {
      window.open(data.url, "_blank");
    } else {
      notify("error", "Something went wrong");
    }
  }

  return (
    <Card className="overflow-auto hover:shadow-lg hover:border hover:border-neutral-400 h-fit lg:w-[48%]">
      <CardHeader>
        <div className="flex flex-col gap-8">
          <div>
            <div className="font-bold break-words">{thesis.title} </div>
            <div className="flex flex-row  gap-1 mt-1 text-sm items-center">
              <User className="h-4 w-4 shrink-0" />
              {thesis.studentFirstName} {thesis.studentLastName}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            {/* <span>Report:</span> */}
            <div className="flex border p-2 items-center w-36 rounded-lg">
              <div className="flex flex-col items-center w-36">
                <span className="text-sm font-medium text-gray-600 max-w-32 truncate">
                  {thesis.fileName}
                </span>
                <p className="text-xs text-gray-500 max-w-32 truncate">
                  {(thesis.fileSize / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>

              <div className="flex gap-1">
                <SquareArrowOutUpRight
                  size={16}
                  className="ml-2 cursor-pointer text-blue-600 mr-2"
                  onClick={() => handleFilePreview()}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="mt-4">
        <div className="flex flex-row gap-12">
          <div>
            <div className="flex flex-row gap-1 items-center">
              <Users className="h-4 w-4 shrink-0" />
              <span className="underline">Committee</span>
            </div>
            <div className="flex flex-row gap-4">
              <div className="flex flex-col gap-2 mt-1">
                <span>Professor:</span>
                <span>Reviewer 1:</span>
                <span>Reviewer 2:</span>
              </div>

              <div className="flex flex-col gap-2 mt-1">
                <div>
                  <span className="font-semibold">
                    {thesis.professorFirstName} {thesis.professorLastName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">
                    {thesis.reviewer1FirstName} {thesis.reviewer1LastName}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">
                    {thesis.reviewer2FirstName} {thesis.reviewer2LastName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-row gap-1 items-center">
              <NotebookPen className="h-4 w-4 shrink-0" />
              <span className="underline">Grades</span>
            </div>
            <div className="flex flex-col gap-2 mt-1 items-center">
              <div>
                <span className="font-semibold">{thesis.professorGrade}</span>
              </div>
              <div>
                <span className="font-semibold">{thesis.reviewer1Grade}</span>
              </div>
              <div>
                <span className="font-semibold">{thesis.reviewer2Grade}</span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex flex-row gap-1 items-center">
              <Award className="h-4 w-4 shrink-0" />
              <span className="underline">Final Grade</span>
            </div>
            <div className="flex flex-col gap-2 mt-1 items-center">
              <div>
                <span className="font-semibold">
                  {getFinalGrade(
                    thesis.professorGrade,
                    thesis.reviewer1Grade,
                    thesis.reviewer2Grade
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-1">
        <div className="flex flex-col">
          <span className="text-sm">Published at:</span>
          <span className="text-xs font-bold">
            {formatDate(thesis.publishedAt)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
