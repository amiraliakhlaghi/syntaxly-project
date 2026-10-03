"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";

const ToastProvider = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3500,
        style: {
          background: isDark ? "#ffffff" : "#020617",
          color: isDark ? "#0f172a" : "#f1f5f9",
          border: `1px solid ${isDark ? "#1e293b" : "#e2e8f0"}`,
          borderRadius: "0.5rem",
          padding: "12px 16px",
          fontSize: "14px",
          fontWeight: 500,
          boxShadow: isDark
            ? "0 8px 24px rgba(0, 0, 0, 0.45)"
            : "0 8px 24px rgba(15, 23, 42, 0.08)",
        },
        success: {
          iconTheme: {
            primary: "#3b82f6",
            secondary: isDark ? "#020617" : "#ffffff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: isDark ? "#020617" : "#ffffff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
