"use client";
import React from "react";
import Image from "next/image";
import { AlertCircle, Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

const Loader = ({ error = false }) => {
  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center  ">
      {!error && (
        <div className="animate-pulse duration-[2000ms]">
          {/* <Image
            src="/images/logo/logo.png"
            alt="loader"
            width={300}
            height={300}
            className="object-contain"
          /> */}
          <Loader2Icon className="animate-spin" size={40} />
        </div>
      )}

      {error && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="bg-white shadow-xl rounded-2xl p-15 flex flex-col items-center gap-4 text-center animate-fade-in">
            <AlertCircle className="text-red-600 w-10 h-10" />
            <h2 className="text-xl font-semibold text-gray-800">
              Oops! Not Found
            </h2>
            <p className="text-sm text-gray-600">Please try again.</p>
            <Button
              onClick={handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loader;
