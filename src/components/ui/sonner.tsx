"use client";

import { CircleAlert, CircleCheck, Info, Loader2, TriangleAlert } from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function keepOpenOnToast(event: Event) {
  if ((event.target as HTMLElement | null)?.closest("[data-sonner-toaster]")) {
    event.preventDefault();
  }
}

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="light"
      position="top-center"
      closeButton
      className="pointer-events-auto"
      icons={{
        success: <CircleCheck className="size-4 text-success" />,
        error: <CircleAlert className="size-4 text-danger" />,
        warning: <TriangleAlert className="size-4 text-warn" />,
        info: <Info className="size-4 text-brand" />,
        loading: <Loader2 className="size-4 animate-spin text-faint" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl! border-hairline! bg-white! font-sans! text-ink! shadow-[0_8px_30px_rgba(15,23,42,0.12)]!",
          title: "text-sm! font-semibold!",
          description: "text-subtle!",
          error: "border-danger/25!",
          closeButton: "bg-white! border-hairline! text-faint! hover:text-ink!",
        },
      }}
      {...props}
    />
  );
}
