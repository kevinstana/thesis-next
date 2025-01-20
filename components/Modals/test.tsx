"use client"

import { useNotification } from "@/providers/NotificationProvider"

export default function Test() {

    const {notify} = useNotification()

    return (
        <button
        className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        onClick={() => notify("error", "hello from add external user")}
      >
        Hello
      </button>  
    )

}