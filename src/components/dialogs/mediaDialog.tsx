import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Play, X } from "lucide-react";

interface MediaDialogProps {
  mediaUrl: string;
  mediaType: "image" | "video";
  altText?: string;
  previewThumbnail?: string;
  triggerElement?: React.ReactNode;
}

export default function MediaDialog({
  mediaUrl,
  mediaType,
  altText = "",
  previewThumbnail,
  triggerElement,
}: MediaDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {triggerElement ? (
          triggerElement
        ) : (
          <div className="relative cursor-pointer group ">
            <div
              className={`relative min-w-18 rounded-t-xl overflow-hidden bg-muted  ${
                mediaType === "image" ? " aspect-square" : "aspect-video"
              }`}
            >
              {mediaType === "image" ? (
                <Image
                  src={previewThumbnail || mediaUrl}
                  alt={altText}
                  fill
                  className="object-cover aspect-square group-hover:brightness-75 transition"
                />
              ) : (
                <>
                  {previewThumbnail ? (
                    <Image
                      src={previewThumbnail}
                      alt={altText}
                      fill
                      className="object-cover group-hover:brightness-75 transition"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Play className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40 text-white  text-sm font-medium">
                {mediaType === "video" && (
                  <div className="p-3 bg-black/50 rounded-full">
                    <Play className="w-6 h-6" />
                  </div>
                )}
                {mediaType === "image" && <span className="">View Media</span>}
              </div>
            </div>
          </div>
        )}
      </DialogTrigger>

      <DialogContent className="[&>button]:text-white max-w-4xl w-full p-0 bg-transparent border-none shadow-none ">
        {/* <DialogClose className="absolute top-4 right-4 text-white hover:text-gray-300 transition">
          <X className="w-6 h-6" />
        </DialogClose> */}
        <div className={`relative w-full ${mediaType == "image" ? "aspect-square":"aspect-video"} aspect-video bg-black rounded-lg overflow-hidden`}>
          {mediaType === "image" ? (
            <Image
              src={mediaUrl}
              alt={altText}
              fill
              className="object-contain aspect-square"
              unoptimized // For external URLs
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              autoPlay
              className="w-full h-full object-contain aspect-video"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {mediaType === "video" && (
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Video
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
