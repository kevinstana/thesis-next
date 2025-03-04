"use client";

import {
  CommitteeMember,
  DetailedThesis,
  ViewThesisModalRef,
} from "@/types/app-types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import BaseModal from "../../BaseModal";
import BaseModalContent from "../../BaseModalContent";
import BaseModalHeader from "../../BaseModalHeader";
import useSWR from "swr";
import RecordNavigation from "../../../RecordNavigation";
import { Loader2 } from "lucide-react";
import { useThesisIdentifiers } from "@/providers/ThesisIdentifiersProvider";
import { getOneThesis } from "@/lib/server-actions";
import Textarea from "../../../Textarea";
import RecommendedCourses from "../../../RecommendedCourses";
import { clsx } from "clsx";
import { Skeleton } from "../../../ui/skeleton";
import ShadcnActionButton from "@/components/Buttons/ShadcnActionButton";
import CommitteMember from "@/components/Committee";
import { CreateThesisBody } from "@/components/Forms/CreateThesisForm";

const initThesis: DetailedThesis = {
  id: "",
  title: "",
  description: "",
  professorFullName: "",
  reviewer1FullName: "",
  reviewer2FullName: "",
  professorId: "",
  reviewer1Id: "",
  reviewer2Id: "",
  status: "",
};

const initialBody = {
  title: "",
  description: "",
  secondReviewerId: 0,
  thirdReviewerId: 0,
  recommendedCourses: [],
};

const committee = [
  { elementId: "reviewer1", label: "Reviewer 1" },
  { elementId: "reviewer2", label: "Reviewer 2" },
];

const ViewThesisModal = forwardRef<ViewThesisModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [thesis, setThesis] = useState<DetailedThesis>(initThesis);
  const [thesisId, setThesisId] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [initCommittee, setInitCommittee] = useState<CommitteeMember[]>([]);
  const { identifiers } = useThesisIdentifiers();

  const [excludedIds, setExcludedIds] = useState<number[]>([]);
  const [body, setBody] = useState<CreateThesisBody>(initialBody);

  const { data, isLoading, isValidating, mutate } = useSWR(
    thesisId ? `thesis-${thesisId}` : null,
    () => getOneThesis(thesisId),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        const data = res.data as DetailedThesis;
        setThesis(data);
        setInitCommittee([
          {
            id: Number(data.reviewer1Id),
            firstName: data.reviewer1FullName.split(" ")[0],
            lastName: data.reviewer1FullName.split(" ")[1],
            username: "",
          },
          {
            id: Number(data.reviewer2Id),
            firstName: data.reviewer2FullName.split(" ")[0],
            lastName: data.reviewer2FullName.split(" ")[1],
            username: "",
          },
        ]);
        setExcludedIds([Number(data.reviewer1Id), Number(data.reviewer2Id)]);
      },
    }
  );

  useEffect(() => {
    setThesis(initThesis);
    if (thesisId) {
      mutate();
    }
  }, [thesisId, mutate]);

  useImperativeHandle(ref, () => ({
    openDialog: (id) => {
      setOpen(true);
      setThesisId(id);
    },
  }));

  function handleCommitteeChange(
    trigger: "add" | "remove",
    id: number,
    label?: string
  ) {
    if (trigger === "add") {
      setExcludedIds((prev) => [...prev, id]);

      switch (label) {
        case "Reviewer 1":
          setBody((prev) => ({
            ...prev,
            secondReviewerId: id,
          }));
          return;
        case "Reviewer 2":
          setBody((prev) => ({
            ...prev,
            thirdReviewerId: id,
          }));
          return;
        default:
          return;
      }
    }

    setExcludedIds(excludedIds.filter((tmp) => tmp !== id));
    switch (label) {
      case "Reviewer 1":
        setBody((prev) => ({
          ...prev,
          secondReviewerId: 0,
        }));
        return;
      case "Reviewer 2":
        setBody((prev) => ({
          ...prev,
          thirdReviewerId: 0,
        }));
        return;
      default:
        return;
    }
  }

  return (
    <BaseModal open={open}>
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <BaseModalHeader title={`Theses / ${thesisId}`} setOpen={setOpen} />

        <div
          className="flex flex-col flex-grow justify-between px-4 pt-4 overflow-hidden"
          tabIndex={-1}
        >
          {/* navigation */}
          <div className="flex flex-col px-6 py-2">
            <div className="flex w-full justify-between">
              {!isLoading || !isValidating ? (
                <div
                  className={clsx(
                    "font-medium text-sm/[1.5rem] rounded-full px-2 py-1 w-fit",
                    {
                      "bg-green-500/20 text-green-500":
                        thesis.status === "AVAILABLE",
                    }
                  )}
                >
                  {thesis.status}
                </div>
              ) : (
                <Skeleton className="rounded-full px-2 py-1 w-24 h-8" />
              )}
              <div>
                <RecordNavigation
                  list={identifiers}
                  value={thesisId}
                  setValue={setThesisId}
                />
              </div>
            </div>
          </div>

          {/* form */}
          {isLoading || isValidating ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div
              className="flex flex-col flex-grow p-4 overflow-auto"
              tabIndex={-1}
            >
              <form className="space-y-6 bg-white px-6 py-1">
                <div className="space-y-1">
                  <label
                    htmlFor="title"
                    className="flex gap-[2px] font-medium text-gray-700"
                  >
                    Title<span className="text-red-300">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-neutral-700 focus:outline-none"
                    maxLength={256}
                    required
                    value={thesis.title}
                  />
                </div>

                <Textarea
                  initDescription={thesis.description}
                  handleDescription={(description: string) => {
                    setThesis((prev) => ({ ...prev, description }));
                  }}
                />

                <RecommendedCourses
                  thesisId={thesisId}
                  type={"editing"}
                />

                <div className="flex flex-col gap-4">
                  <div className="font-medium text-gray-700">
                    Three-member committee
                  </div>

                  {committee.map((member, index) => (
                    <CommitteMember
                      key={index}
                      elementId={member.elementId}
                      label={member.label}
                      initMember={initCommittee[index]}
                      excludedIds={excludedIds}
                      handleCommitteeChange={handleCommitteeChange}
                    />
                  ))}
                </div>
              </form>
            </div>
          )}
        </div>

        <div className="flex p-6 gap-2 justify-end border border-t-neutral-300">
          <ShadcnActionButton
            type={"submit"}
            text={pending ? "Saving..." : "Save"}
            handleClick={() => {}}
            disabled={pending}
          />

          <ShadcnActionButton
            type="button"
            text={"Close"}
            className="bg-white border border-neutral-700 hover:bg-neutral-100 text-black py-2 px-4 rounded"
            handleClick={() => setOpen(false)}
            disabled={pending}
          />
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

ViewThesisModal.displayName = "ViewThesisModal";

export { ViewThesisModal };
