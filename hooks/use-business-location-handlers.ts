import { extractAddressComponents } from "@/lib/helper";
import { BusinessLocationFormData } from "@/lib/schemas/business-registration-schema";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { UseFormSetValue, UseFormTrigger } from "react-hook-form";

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

interface UseBusinessLocationHandlersProps {
  form: {
    setValue: UseFormSetValue<BusinessLocationFormData>;
    trigger: UseFormTrigger<BusinessLocationFormData>;
  };
  setSelectedLocation: (location: { lat: number; lng: number } | null) => void;
  setSelectedAddress: (address: string) => void;
}

/**
 * Custom hook for handling business location selection logic
 * Extracts address components and updates form/store
 */
export const useBusinessLocationHandlers = ({
  form,
  setSelectedLocation,
  setSelectedAddress,
}: UseBusinessLocationHandlersProps) => {
  const { user } = useUserAuthStore();

  /**
   * Updates form fields and store with location data
   */
  const updateLocationData = (
    lat: number,
    lng: number,
    address: string,
    street: string | null | undefined,
    city: string | null | undefined,
    state: string | null | undefined,
    country: string,
    postalCode: string
  ) => {
    // Normalize optional fields to null if empty
    const normalizedStreet = street && street.trim() ? street.trim() : null;
    const normalizedCity = city && city.trim() ? city.trim() : null;
    const normalizedState = state && state.trim() ? state.trim() : null;

    // Update form values with validation
    form.setValue('merchantId', user?.id || '', { shouldValidate: true });
    form.setValue('storeNo', '1', { shouldValidate: true });
    form.setValue('address', address, { shouldValidate: true });
    form.setValue('street', normalizedStreet, { shouldValidate: true });
    form.setValue('city', normalizedCity, { shouldValidate: true });
    form.setValue('state', normalizedState, { shouldValidate: true });
    form.setValue('country', country, { shouldValidate: true });
    form.setValue('postalCode', postalCode, { shouldValidate: true });
    form.setValue('latitude', lat, { shouldValidate: true });
    form.setValue('longitude', lng, { shouldValidate: true });
    form.setValue('active', true, { shouldValidate: true });

    // Trigger validation for all fields
    form.trigger();
  };

  /**
   * Parses formatted address as fallback when components are missing
   */
  const parseFormattedAddress = (
    formattedAddress: string,
    currentStreet: string,
    currentCity: string,
    currentState: string,
    currentPostalCode: string
  ): { street: string; city: string; state: string; postalCode: string } => {
    const addressParts = formattedAddress.split(', ');
    let street = currentStreet;
    let city = currentCity;
    let state = currentState;
    let postalCode = currentPostalCode;

    if (!street && addressParts.length > 0) {
      street = addressParts[0].trim();
    }

    if (!city && addressParts.length >= 2) {
      city = addressParts[1].trim();
    }

    if (!state && addressParts.length >= 3) {
      // Try to find state in the parts (Nigerian states)
      const nigerianStates = /^(Lagos|Abuja|Kano|Rivers|Kaduna|Oyo|Enugu|Delta|Ogun|Osun|Kwara|Benue|Plateau|Edo|Akwa Ibom|Cross River|Imo|Anambra|Bauchi|Borno|Gombe|Jigawa|Katsina|Kebbi|Kogi|Nasarawa|Niger|Sokoto|Taraba|Yobe|Zamfara|Bayelsa|Ebonyi|Ekiti)$/i;
      for (let i = addressParts.length - 2; i >= 0; i--) {
        const part = addressParts[i].trim();
        if (part.match(nigerianStates)) {
          state = part;
          break;
        }
      }
      if (!state && addressParts.length >= 2) {
        state = addressParts[addressParts.length - 2].trim();
      }
    }

    // Extract postal code from formatted address
    if (postalCode === '100001') {
      const zipMatch = formattedAddress.match(/\b\d{5,6}\b/);
      if (zipMatch) {
        postalCode = zipMatch[0];
      }
    }

    return { street, city, state, postalCode };
  };

  /**
   * Performs reverse geocoding to get address components
   */
  const reverseGeocode = async (
    lat: number,
    lng: number
  ): Promise<{ street: string; city: string; state: string; country: string; postalCode: string } | null> => {
    if (typeof window === 'undefined' || !window.google) {
      return null;
    }

    const geocoder = new window.google.maps.Geocoder();

    return new Promise((resolve) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const formattedAddress = result.formatted_address;

            // Extract address components using the helper function
            const extracted = extractAddressComponents(result.address_components);
            let { street, city, state, postalCode } = extracted;
            const { country } = extracted;

            // Fallback: Parse formatted address if components are missing
            if (!street || !city || !state) {
              const parsed = parseFormattedAddress(formattedAddress, street, city, state, postalCode);
              street = parsed.street;
              city = parsed.city;
              state = parsed.state;
              postalCode = parsed.postalCode;
            }

            resolve({ street, city, state, country, postalCode });
          } else {
            resolve(null);
          }
        }
      );
    });
  };

  /**
   * Handles place selection from Google Places search
   */
  const handlePlaceSelect = async (
    place: GooglePlaceResult | { geometry: { location: { lat: number; lng: number } }; formatted_address: string }
  ) => {
    const { lat, lng } = place.geometry.location;
    const address = place.formatted_address;

    // Try to extract address components if available
    let { street, city, state, country, postalCode } =
      'address_components' in place && place.address_components
        ? extractAddressComponents((place as GooglePlaceResult).address_components)
        : { street: '', city: '', state: '', country: 'Nigeria', postalCode: '100001' };

    // If address components are missing, use reverse geocoding
    if (!street || !city || !state) {
      const geocoded = await reverseGeocode(lat, lng);
      if (geocoded) {
        street = geocoded.street || street;
        city = geocoded.city || city;
        state = geocoded.state || state;
        country = geocoded.country || country;
        postalCode = geocoded.postalCode || postalCode;
      }
    }

    // Update UI state
    setSelectedLocation({ lat, lng });
    setSelectedAddress(address);

    // Update form and store
    updateLocationData(lat, lng, address, street, city, state, country, postalCode);
  };

  /**
   * Handles location selection from map click
   */
  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    // Update UI state immediately
    setSelectedLocation({ lat, lng });
    setSelectedAddress(address);

    // Use reverse geocoding to get structured address components
    if (typeof window !== 'undefined' && window.google) {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat, lng } },
        (results: google.maps.GeocoderResult[] | null, status: google.maps.GeocoderStatus) => {
          if (status === 'OK' && results && results[0]) {
            const result = results[0];
            const formattedAddress = result.formatted_address;

            // Extract address components using the helper function
            const extracted = extractAddressComponents(result.address_components);
            let { street, city, state, postalCode } = extracted;
            const { country } = extracted;

            // Fallback: Parse formatted address if components are missing
            if (!street || !city || !state) {
              const parsed = parseFormattedAddress(formattedAddress, street, city, state, postalCode);
              street = parsed.street;
              city = parsed.city;
              state = parsed.state;
              postalCode = parsed.postalCode;
            }

            // Update form and store
            updateLocationData(lat, lng, formattedAddress, street, city, state, country, postalCode);

            // Update selected address with formatted address
            setSelectedAddress(formattedAddress);
          } else {
            console.error('Geocoding failed:', status);
            // Fallback to simple parsing if geocoding fails
            const addressParts = address.split(', ');
            const street = addressParts[0] || '';
            const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2] ?? 'Lagos' : 'Lagos';
            const state = addressParts.length >= 2 ? addressParts[addressParts.length - 1] ?? 'Lagos' : 'Lagos';
            const zipMatch = address.match(/\b\d{6}\b/);
            const postalCode = zipMatch ? zipMatch[0] : '100001';

            updateLocationData(lat, lng, address, street, city, state, 'Nigeria', postalCode);
          }
        }
      );
    } else {
      // Fallback if Google Maps is not available
      const addressParts = address.split(', ');
      const street = addressParts[0] || '';
      const city = addressParts.length >= 2 ? addressParts[addressParts.length - 2] ?? 'Lagos' : 'Lagos';
      const state = addressParts.length >= 2 ? addressParts[addressParts.length - 1] ?? 'Lagos' : 'Lagos';
      const zipMatch = address.match(/\b\d{6}\b/);
      const postalCode = zipMatch ? zipMatch[0] : '100001';

      updateLocationData(lat, lng, address, street, city, state, 'Nigeria', postalCode);
    }
  };

  return {
    handlePlaceSelect,
    handleLocationSelect,
  };
};

