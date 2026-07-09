"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CreateDeliveryAddressField } from "@/lib/create-delivery-addresses";
import type { GeoPoint } from "@/types/service-area";

export type MapTapState = "pickup" | "dropoff" | "both";

function getInitialTapState(
  pickupResolved: boolean,
  dropoffResolved: boolean,
): MapTapState {
  if (pickupResolved && dropoffResolved) {
    return "both";
  }

  if (pickupResolved) {
    return "dropoff";
  }

  return "pickup";
}

export function useMapTapController({
  pickupResolved,
  dropoffResolved,
  onResolve,
}: {
  pickupResolved: boolean;
  dropoffResolved: boolean;
  onResolve: (
    field: CreateDeliveryAddressField,
    point: GeoPoint,
  ) => Promise<boolean>;
}) {
  const [tapState, setTapState] = useState<MapTapState>(() =>
    getInitialTapState(pickupResolved, dropoffResolved),
  );
  const [toast, setToast] = useState<string | null>(null);
  const isResolvingRef = useRef(false);

  const handleMapTap = useCallback(
    async (point: GeoPoint) => {
      if (isResolvingRef.current) {
        return;
      }

      const field: CreateDeliveryAddressField =
        tapState === "dropoff" ? "dropoff" : "pickup";

      isResolvingRef.current = true;

      try {
        const didResolve = await onResolve(field, point);

        if (!didResolve) {
          return;
        }

        setTapState((current) => {
          if (current === "pickup") {
            return "dropoff";
          }

          if (current === "dropoff") {
            return "both";
          }

          return "dropoff";
        });
      } finally {
        isResolvingRef.current = false;
      }
    },
    [onResolve, tapState],
  );

  useEffect(() => {
    const message =
      tapState === "pickup"
        ? "Tap pentru a seta adresa de ridicare"
        : tapState === "dropoff"
          ? "Acum tap pentru adresa de livrare"
          : null;

    let hideTimeoutId: number | undefined;
    const showTimeoutId = window.setTimeout(() => {
      setToast(message);

      if (message) {
        hideTimeoutId = window.setTimeout(() => setToast(null), 2000);
      }
    }, 0);

    return () => {
      window.clearTimeout(showTimeoutId);

      if (hideTimeoutId !== undefined) {
        window.clearTimeout(hideTimeoutId);
      }
    };
  }, [tapState]);

  const isPlacing = tapState !== "both";

  return { tapState, handleMapTap, toast, isPlacing };
}
