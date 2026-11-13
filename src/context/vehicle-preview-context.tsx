"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Veiculo } from "@/lib/types";
import { VehiclePreviewModal } from "@/components/vehicles/vehicle-preview-modal";

interface VehiclePreviewContextValue {
  openPreview: (vehicle: Veiculo) => void;
  closePreview: () => void;
}

const VehiclePreviewContext = createContext<VehiclePreviewContextValue | null>(
  null,
);

export function VehiclePreviewProvider({ children }: { children: ReactNode }) {
  const [vehicle, setVehicle] = useState<Veiculo | null>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const closePreview = useCallback(() => {
    setOpen(false);
    setVehicle(null);
  }, []);

  const openPreview = useCallback((v: Veiculo) => {
    setVehicle(v);
    setOpen(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    setVehicle(null);
  }, [pathname]);

  const value = useMemo(
    () => ({ openPreview, closePreview }),
    [openPreview, closePreview],
  );

  return (
    <VehiclePreviewContext.Provider value={value}>
      {children}
      <VehiclePreviewModal
        vehicle={vehicle}
        open={open}
        onOpenChange={(next) => {
          if (!next) closePreview();
          else setOpen(true);
        }}
      />
    </VehiclePreviewContext.Provider>
  );
}

export function useVehiclePreview() {
  const ctx = useContext(VehiclePreviewContext);
  if (!ctx) {
    throw new Error("useVehiclePreview must be used within VehiclePreviewProvider");
  }
  return ctx;
}
