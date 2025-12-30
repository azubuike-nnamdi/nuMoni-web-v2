import GoogleMap from "@/components/ui/google-map";
import { PlacesSearch } from "@/components/ui/places-search";

interface GooglePlaceResult {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  formatted_address: string;
  address_components?: Array<{
    long_name: string;
    types: string[];
  }>;
}

interface LocationSearchSectionProps {
  onPlaceSelect: (place: GooglePlaceResult | { geometry: { location: { lat: number; lng: number } }; formatted_address: string }) => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  selectedAddress: string;
  selectedLocation: { lat: number; lng: number } | null;
}

export default function LocationSearchSection({
  onPlaceSelect,
  onLocationSelect,
  selectedAddress,
  selectedLocation,
}: LocationSearchSectionProps) {
  return (
    <div className="space-y-4">
      <PlacesSearch
        onPlaceSelect={onPlaceSelect}
        placeholder="E.G 45 Sunny Plaza, Victoria Island Road"
        selectedAddress={selectedAddress}
      />

      <GoogleMap
        onLocationSelect={onLocationSelect}
        initialCenter={{ lat: 6.5244, lng: 3.3792 }} // Lagos, Nigeria
        center={selectedLocation || undefined}
        className="h-96 w-full"
      />
    </div>
  );
}

