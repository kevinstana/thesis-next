"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Loader2, MoveRight } from "lucide-react";
import { Button } from "../ui/button";
import { authFetch } from "@/lib/server-actions";
import { useNotification } from "@/providers/NotificationProvider";
import useSWR from "swr";

export default function Dates({
  title,
  endpoint,
}: {
  title: string;
  endpoint: string;
}) {
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [tmpFromDate, setTmpFromDate] = useState<string>("");
  const [tmpToDate, setTmpToDate] = useState<string>("");
  const { notify } = useNotification();

  const { isLoading, isValidating, mutate } = useSWR(
    title,
    () => authFetch(`${endpoint}`, "GET", null),
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onSuccess: (res) => {
        setTmpFromDate(res.data.from);
        setTmpToDate(res.data.to);
        setFromDate(res.data.from ? new Date(res.data.from).toISOString().split("T")[0] : "");
        setToDate(res.data.to ? new Date(res.data.to).toISOString().split("T")[0] : "");
      },
    }
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  const formatToUTC = (date: string, time: string): string => {
    const localDate = new Date(`${date}T${time}:00Z`);
    return localDate.toISOString();
  };

  const handleFromDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const selectedDate = e.target.value;
    setFromDate(selectedDate);
    const utcDate = formatToUTC(selectedDate, "00:01");
    setTmpFromDate(utcDate);
  };

  const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedDate = e.target.value;
    setToDate(selectedDate);
    const utcDate = formatToUTC(selectedDate, "23:59");
    setTmpToDate(utcDate);
  };

  async function handleSubmit() {
    if (!fromDate) {
      notify("error", "From date required");
      return;
    }

    if (!toDate) {
      notify("error", "To date required");
      return;
    }

    const fromDateObj = new Date(fromDate);
    const toDateObj = new Date(toDate);

    if (fromDateObj >= toDateObj) {
      notify("error", "From date cannot be smaller than To date");
      return;
    }

    const { status } = await authFetch(`${endpoint}`, "POST", {
      from: tmpFromDate,
      to: tmpToDate,
    });

    if (status === 200) {
      mutate();
      notify("success", "Date saved");
    } else {
      notify("error", "Something went wrong");
    }
  }

  if (isValidating || isLoading) {
    return (
      <Card>
        <CardContent className="flex h-[9.5rem] w-full items-center justify-center">
          <Loader2 className="mt-8 h-14 w-14 animate-spin" strokeWidth={0.5} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h1 className="font-bold">{title}</h1>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-10">
          <div className="flex flex-col gap-1">
            <label htmlFor="fromDate" className="font-semibold">
              From:
            </label>
            <input
              name="fromDate"
              type="date"
              className="w-32"
              value={fromDate}
              onChange={handleFromDateChange}
            />
          </div>

          <MoveRight className="mt-4" />

          <div className="flex flex-col gap-1">
            <label htmlFor="toDate" className="font-semibold">
              To:
            </label>
            <input
              name="toDate"
              type="date"
              className="w-32"
              value={toDate}
              onChange={handleToDateChange}
            />
          </div>

          <Button className="mt-4" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
