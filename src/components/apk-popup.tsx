"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISMISS_KEY = "apk-popup-dismissed";

/** Nudge to install the native Android build. Shown once per browser session. */
export function ApkPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY)) return;
    const timer = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    sessionStorage.setItem(DISMISS_KEY, "true");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-8 backdrop-blur-sm">
      <div
        className="animate-slide-up relative flex w-full max-w-[360px] flex-col items-center rounded-[1.25rem] border border-white/10 p-10 px-8 text-center"
        style={{
          background: "rgba(10,15,36,0.7)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.6), inset 0 1px rgba(255,255,255,0.1)",
        }}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="absolute top-4 right-4 p-2 text-subtle transition-colors hover:text-ink"
        >
          <X size={18} />
        </button>

        <div className="mb-4 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-brand/20 text-brand">
          <Download size={24} />
        </div>

        <h3 className="mb-2 text-xl font-bold text-ink">Get the Mobile App</h3>
        <p className="mb-6 text-sm leading-snug text-subtle">
          For the best experience, download the native Android app directly to your
          device.
        </p>

        <Button
          asChild
          className="btn-glow h-auto w-full rounded-[3rem] py-4 text-base font-semibold"
          onClick={dismiss}
        >
          <a href="/lead-app.apk" download="lead-app.apk">
            Download APK
          </a>
        </Button>
      </div>
    </div>
  );
}
