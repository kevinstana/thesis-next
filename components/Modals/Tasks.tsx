"use client";

import { TasksModalRef } from "@/types/app-types";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import BaseModal from "./BaseModal";
import BaseModalContent from "./BaseModalContent";
import { Loader2, Plus } from "lucide-react";
import ModalHeaderWithArrow from "./ModalHeaderWithArrow";
import TaskCard from "../TaskCards";
import { Task } from "@/types/response-types";

const TasksModal = forwardRef<TasksModalRef>((_, ref) => {
  const [open, setOpen] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [thesisId, setThesisId] = useState<string>("");

  useImperativeHandle(ref, () => ({
    openDialog: (id) => {
      setOpen(true);
      //   mutate();
      setThesisId(id);
    },
  }));

  useEffect(() => {
    if (thesisId) {
      //   mutate();
    }
  }, [thesisId]);

  function handleSave(type: "SAVE" | "CANCEL", body: Task) {
    console.log(body);
    switch (type) {
      case "SAVE":
        alert("saving");
        return;
      case "CANCEL":
        setIsAdding(false);
        return;
      default:
        return;
    }
  }

  // async function handleSubmit() {}

  return (
    <BaseModal open={open} className="bg-transparent">
      <BaseModalContent className="bg-white w-[60%] h-[90%] rounded-md flex flex-col relative">
        <ModalHeaderWithArrow title="Thesis Title / Tasks" setOpen={setOpen} />

        <div
          className="flex flex-col flex-grow justify-between pt-4 overflow-auto"
          tabIndex={-1}
        >
          {1 !== 1 ? (
            <div className="w-full h-full flex items-center justify-center">
              <Loader2
                className="mr-2 h-14 w-14 animate-spin"
                strokeWidth={0.5}
              />
            </div>
          ) : (
            <div className="flex flex-col px-8 py-4 gap-4">
              <button
                type="button"
                className="w-fit gap-1 flex items-center px-3 py-1 border border-gray-300 rounded-md bg-neutral-100 hover:bg-neutral-200"
                onClick={() => {
                  if (!isAdding) {
                    setIsAdding(true);
                  }
                }}
              >
                <Plus size={16} /> Add Task
              </button>
              {isAdding && (
                <TaskCard
                  mode="ADDING"
                  handleSave={handleSave}
                  task={{
                    id: 0,
                    title: "",
                    description: "",
                    priority: "",
                    status: "",
                    thesisId: 0,
                    createdAt: "",
                  }}
                />
              )}
              {/* <TaskCard /> */}
            </div>
          )}
        </div>
      </BaseModalContent>
    </BaseModal>
  );
});

TasksModal.displayName = "TasksModal";

export { TasksModal };
