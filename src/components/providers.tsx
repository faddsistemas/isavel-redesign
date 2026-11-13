"use client";

import type { ReactNode } from "react";
import { VehiclePreviewProvider } from "@/context/vehicle-preview-context";

export function Providers({ children }: { children: ReactNode }) {
  return <VehiclePreviewProvider>{children}</VehiclePreviewProvider>;
}
