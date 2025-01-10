"use client";

import { useEffect, useRef } from "react";
import { customLogout } from "./actions";

export default function Page() {
  const formRef = useRef<HTMLFormElement | null>(null);
  useEffect(() => {
    formRef.current?.requestSubmit();
  }, []);

  return <form ref={formRef} action={customLogout} />;
}
