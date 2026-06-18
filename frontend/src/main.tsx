import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ToastProvider } from "@/shared/components/ToastProvider";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/context/AuthContext";
import UploadCenter from "@/features/uploads/components/UploadCenter";

import "@/style/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10, // ✅ antes cacheTime
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>

          <RouterProvider router={router} />

          <UploadCenter />

        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);