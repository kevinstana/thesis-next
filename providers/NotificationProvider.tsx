import React, { createContext, useContext } from "react"
import { useToast } from "@/hooks/use-toast"
import type { ToastProps } from "@/components/ui/toast"
import CheckMark from "@/iconography/CheckMark";
import ErrorIcon from "@/iconography/ErrorIcon";
import { Toaster } from "@/components/ui/toaster";

const genericMessages: Record<
  NotificationType,
  { message: string; icon: React.ReactNode }
> = {
  success: {
    message: "The operation was successful!",
    icon: <CheckMark />,
  },
  error: {
    message: "Something went wrong. Please try again!",
    icon: <ErrorIcon />,
  },
}

export type NotificationType = Exclude<ToastProps["variant"], null | undefined>

interface ContextType {
  notify: (variant: NotificationType, message?: string) => void
}

const Context = createContext<ContextType | undefined>(undefined)
const { Provider } = Context

function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element {
  const { toast } = useToast()

  const notify = (variant: NotificationType, _message?: string): void => {
    const message = _message ?? genericMessages[variant].message
    const icon = genericMessages[variant].icon
    console.log("notification", variant, message)
    toast({
      variant,
      description: (
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-neutral-white">{message}</span>
        </div>
      ),
    } as ToastProps)
  }

  return (
    <Provider value={{ notify }}>
      <>
      {children}
      <Toaster />
      </>
    </Provider>
  )
}

const useNotification = (): ContextType => {
  const context = useContext(Context)
  if (!context) {
    throw new Error(
      "useNotification must be used within the NotificationProvider"
    )
  }
  return context
}

export { NotificationProvider, useNotification }
