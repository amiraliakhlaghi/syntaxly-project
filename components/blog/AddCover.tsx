"use client";

import { useEdgeStore } from "@/lib/edgestore";
import { cn } from "@/lib/utils";
import { AddCoversProps } from "@/types";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const AddCover = ({ setUploadedCover, replaceUrl }: AddCoversProps) => {
  const imgInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isuploading, setIsUploading] = useState(false);
  const { edgestore } = useEdgeStore();

  const handleButtonClick = () => imgInputRef.current?.click();

  useEffect(() => {
    let isMounted = true;

    const uploadImage = async () => {
      if (!file) return;
      setIsUploading(true);

      try {
        const res = await edgestore.publicFiles.upload({
          file,
          options: replaceUrl ? { replaceTargetUrl: replaceUrl } : undefined,
        });

        if (isMounted && res.url) {
          setUploadedCover(res.url);
        }
      } catch (error) {
        toast.error("Upload failed. Please try again");
      } finally {
        if (isMounted) {
          setIsUploading(false);
        }
      }
    };

    uploadImage();

    return () => {
      isMounted = false;
    };
  }, [file]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        ref={imgInputRef}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className={cn(
          "flex items-center gap-2",
          isuploading ? "opacity-50 cursor-not-allowed" : "",
        )}
        disabled={isuploading ? true : false}
      >
        <ImageIcon size={20} />
        <span>{!!replaceUrl ? "Change Cover" : "Add Cover"}</span>
      </button>
      {isuploading && <p className="text-green-500">Uploading...</p>}
    </div>
  );
};

export default AddCover;
