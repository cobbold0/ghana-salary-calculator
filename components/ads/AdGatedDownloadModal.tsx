"use client";

import React, { useEffect } from "react";
import { AdSlot } from "@/components/site/AdSlot";

interface AdGatedDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void | Promise<void>;
  fileName?: string;
}

export function AdGatedDownloadModal({
  isOpen,
  onClose,
  onDownload,
  fileName = "Ghana-Payslip-Estimate.pdf",
}: AdGatedDownloadModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ad-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl border border-border sm:p-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-full p-2 text-muted hover:bg-background hover:text-foreground transition"
        >
          <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-brand/10 text-brand">
            <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 id="ad-modal-title" className="text-xl font-bold text-foreground sm:text-2xl">
            Your Payslip Summary is Ready!
          </h2>
          <p className="mt-1 text-sm text-muted">
            {fileName} is calculated with official GRA & SSNIT rates. Click below to print or save your PDF.
          </p>
        </div>

        {/* High-Impression In-Modal Ad Slot */}
        <div className="my-5 rounded-xl border border-border bg-background/50 p-2 overflow-hidden text-center min-h-[250px] flex flex-col items-center justify-center">
          <AdSlot variant="inline" label="Sponsored" className="my-0" />
        </div>

        {/* Final Download Button */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3.5 text-base font-bold text-white shadow-md hover:bg-brand/90 active:scale-[0.98] transition cursor-pointer"
          >
            <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download / Print Payslip PDF
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-xs text-muted hover:text-foreground py-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
