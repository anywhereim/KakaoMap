"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface Props {
  children?: React.ReactNode;
}

const queryClient = new QueryClient();
export function QueryProvider({ children }: Props) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>{children}</div>
      </QueryClientProvider>
    </>
  );
}
