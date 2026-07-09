"use client";

import { useState } from "react";
import { AddressDrawer, type AddressDrawerState } from "@/components/delivery/mobile/address-drawer";
import { useMapTapController } from "@/components/delivery/mobile/map-tap-controller";
import { LazyMapContainer } from "@/components/maps/lazy-map-container";
import { cn } from "@/lib/utils";
import type {
  CreateDeliveryAddressDraft,
  CreateDeliveryAddressField,
  CreateDeliveryAddressValidation,
} from "@/lib/create-delivery-addresses";
import type { GeoapifyAddressSuggestion } from "@/types/geoapify";
import type {
  MapLineDefinition,
  MapMarkerDefinition,
  MapOverlayDefinition,
} from "@/types/map";
import type { SavedPlace } from "@/types/saved-places";
import type { GeoPoint } from "@/types/service-area";

type CreateDeliveryMapStepProps = {
  mapViewport: { center: GeoPoint; zoom: number };
  mapMarkers: readonly MapMarkerDefinition[];
  routeMapLines: readonly MapLineDefinition[];
  serviceAreaOverlays: readonly MapOverlayDefinition[];
  pickup: CreateDeliveryAddressDraft;
  dropoff: CreateDeliveryAddressDraft;
  pickupValidation: CreateDeliveryAddressValidation;
  dropoffValidation: CreateDeliveryAddressValidation;
  savedPlaces: readonly SavedPlace[];
  isLocked: boolean;
  routeReady: boolean;
  platformGateMessage: string | null;
  onAddressChange: (field: CreateDeliveryAddressField, value: string) => void;
  onAddressSelect: (
    field: CreateDeliveryAddressField,
    suggestion: GeoapifyAddressSuggestion,
  ) => void;
  onSavedPlaceSelect: (
    field: CreateDeliveryAddressField,
    place: SavedPlace,
  ) => void;
  onResolveAddressFromMapPoint: (
    field: CreateDeliveryAddressField,
    point: GeoPoint,
  ) => Promise<boolean>;
  onContinue: () => void;
};

export function CreateDeliveryMapStep({
  mapViewport,
  mapMarkers,
  routeMapLines,
  serviceAreaOverlays,
  pickup,
  dropoff,
  pickupValidation,
  dropoffValidation,
  savedPlaces,
  isLocked,
  routeReady,
  platformGateMessage,
  onAddressChange,
  onAddressSelect,
  onSavedPlaceSelect,
  onResolveAddressFromMapPoint,
  onContinue,
}: CreateDeliveryMapStepProps) {
  const [drawerState, setDrawerState] = useState<AddressDrawerState>("collapsed");
  const [activeField, setActiveField] =
    useState<CreateDeliveryAddressField>("pickup");

  const { handleMapTap, toast, isPlacing } = useMapTapController({
    pickupResolved: Boolean(pickupValidation.geocodedAddress),
    dropoffResolved: Boolean(dropoffValidation.geocodedAddress),
    onResolve: onResolveAddressFromMapPoint,
  });

  const noticeMessage =
    pickupValidation.state === "outside" || dropoffValidation.state === "outside"
      ? "Adresa e în afara zonei active Pitești."
      : platformGateMessage;

  const continueReady = routeReady && !platformGateMessage;
  const showCrosshair = isPlacing && drawerState === "collapsed";

  return (
    <div className="relative h-dvh min-h-svh overflow-hidden bg-[#081416]">
      <LazyMapContainer
        className={cn(
          "mobile-create-map map-surface--premium absolute inset-0 z-0 h-full min-h-full rounded-none border-0 shadow-none",
          showCrosshair && "[&_canvas]:cursor-crosshair",
        )}
        ariaLabel="Hartă creare livrare"
        center={mapViewport.center}
        zoom={mapViewport.zoom}
        interactive
        showNavigation={false}
        markers={mapMarkers}
        lines={routeMapLines}
        overlays={serviceAreaOverlays}
        onPointSelect={handleMapTap}
      />

      {toast ? (
        <div
          className="pointer-events-none absolute inset-x-0 z-40 flex justify-center px-4"
          style={{
            bottom:
              "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom) + 248px + 0.75rem)",
          }}
        >
          <div className="rounded-full border border-border/80 bg-background/95 px-4 py-2 text-xs font-medium text-foreground shadow-[var(--elevation-soft)] backdrop-blur-md">
            {toast}
          </div>
        </div>
      ) : null}

      <AddressDrawer
        state={drawerState}
        onStateChange={setDrawerState}
        activeField={activeField}
        onActiveFieldChange={setActiveField}
        pickup={pickup}
        dropoff={dropoff}
        pickupValidation={pickupValidation}
        dropoffValidation={dropoffValidation}
        savedPlaces={savedPlaces}
        isLocked={isLocked}
        routeReady={continueReady}
        outOfZoneMessage={noticeMessage}
        onAddressChange={onAddressChange}
        onAddressSelect={onAddressSelect}
        onSavedPlaceSelect={onSavedPlaceSelect}
        onContinue={onContinue}
      />
    </div>
  );
}
