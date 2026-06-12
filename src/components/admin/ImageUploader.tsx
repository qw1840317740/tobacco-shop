"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
  currentImage?: string;
  onUpload: (url: string) => void;
  compact?: boolean;
}

function fileToDataUrl(file: File, maxSize = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;
        // Resize if larger than maxSize
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = Math.round((height / width) * maxSize);
            width = maxSize;
          } else {
            width = Math.round((width / height) * maxSize);
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ImageUploader({ currentImage, onUpload, compact }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("画像ファイルを選択してください");
      return;
    }
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onUpload(dataUrl);
      toast.success("画像を設定しました");
    } catch {
      toast.error("画像の読み込みに失敗しました");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  if (compact) {
    return (
      <div
        className="relative cursor-pointer group"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {currentImage ? (
          <img src={currentImage} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#F5F5F5] text-[#888888]">
            <span>📷</span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="text-xs font-medium text-white">
            {uploading ? "処理中..." : "画像を変更"}
          </span>
        </div>
        {dragOver && (
          <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-[#C8A97E] bg-[#C8A97E]/10">
            <span className="text-xs font-medium text-[#C8A97E]">ドロップ</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
        dragOver ? "border-[#C8A97E] bg-[#F5F5F5]" : "border-[#E5E5E5] hover:border-[#E5E5E5]"
      }`}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {currentImage ? (
        <img src={currentImage} alt="Preview" className="mx-auto h-32 w-32 rounded-lg object-cover" />
      ) : (
        <div className="text-4xl mb-2">📷</div>
      )}
      <p className="mt-2 text-sm text-[#888888]">
        {uploading ? "処理中..." : "クリックまたはドラッグして画像をアップロード"}
      </p>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  );
}
