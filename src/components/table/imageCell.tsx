"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImageCellProps {
  imageUrl: string;
  label: string;
  width?: number;
  height?: number;
}
export function ImageCell({
  imageUrl,
  label,
  width = 100,
  height = 100,
}: ImageCellProps) {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!imageUrl) {
      setIsValid(false);
      return;
    }

    const img: HTMLImageElement = new window.Image(); // ✅ explicitly typed
    img.src = imageUrl;

    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);
  }, [imageUrl]);

  return isValid ? (
    <a href={imageUrl} target="_blank" rel="noopener noreferrer">
      <Image
        src={imageUrl}
        alt={label}
        width={width}
        height={height}
        className="rounded-sm"
      />
    </a>
  ) : (
    "N/A"
  );
}
