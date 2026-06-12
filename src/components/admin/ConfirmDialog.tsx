"use client";

import { useState } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "削除", onConfirm, onCancel }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onCancel}>
      <div className="mx-4 w-full max-w-sm rounded-lg bg-white p-6 shadow-sm" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        <p className="mt-2 text-sm text-[#888888]">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-[#E5E5E5] px-4 py-2 text-sm font-medium text-[#888888] hover:bg-[#F5F5F5]"
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
