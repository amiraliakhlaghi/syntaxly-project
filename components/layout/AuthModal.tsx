"use client";

import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  children: ReactNode;
}

const AuthModal = ({ children }: AuthModalProps) => {
  const router = useRouter();

  const closeModal = (e: any) => {
    if (e.target === e.currentTarget) router.back();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={closeModal}
    >
      <div className="relative bg-white dark:bg-slate-900 px-6 pb-6 pt-10 rounded-lg shadow-lg max-w-md w-full max-h-[92vh] overflow-y-hidden">
        <button
          onClick={() => router.back()}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default AuthModal;
