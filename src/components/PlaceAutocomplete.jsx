import React, { useEffect, useRef, useState } from 'react';

// A constant for the script ID to avoid magic strings
const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

function PlaceAutocomplete({ onSelect }) {
  const autocompleteRef = useRef(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    // This function will initialize the autocomplete element
    const initAutocomplete = () => {
      // Ensure the google maps API is loaded and the ref is available
      if (!window.google || !window.google.maps || !window.google.maps.places || !autocompleteRef.current) {
        return;
      }

      const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();

      placeAutocomplete.addEventListener('gmp-select', async (event) => {
        // The toPlace() method is part of the new Place class
        const place = event.placePrediction.toPlace();

        if (onSelect) {
          await place.fetchFields({
            fields: ['displayName', 'formattedAddress', 'location'],
          });
          // Extract the needed details. You can customize the fields.
          const placeDetails = {
            name: place.displayName,
            address: place.formattedAddress,
            location: {
              lat: place.location.latitude,
              lng: place.location.longitude,
            }
          };
          setSelectedPlace(placeDetails);
          onSelect(placeDetails);
        }
      });

      // Clear the container and append the new autocomplete element
      autocompleteRef.current.innerHTML = '';
      autocompleteRef.current.appendChild(placeAutocomplete);
    };

    // Check if the script is already on the page
    if (!document.getElementById(GOOGLE_MAPS_SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = GOOGLE_MAPS_SCRIPT_ID;
      // We remove the callback parameter as we will handle initialization ourselves
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;

      // When the script loads, run our initialization function
      script.onload = initAutocomplete;

      document.body.appendChild(script);
    } else {
      // If the script is already there, just initialize the component
      initAutocomplete();
    }
  }, [onSelect]); // Add onSelect to the dependency array

  return (
    <div className="space-y-2">
      <div ref={autocompleteRef} className="gmp-autocomplete"></div>
      {selectedPlace && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-green-600">📍</span>
            <div>
              <p className="font-medium text-green-800">{selectedPlace.name}</p>
              <p className="text-sm text-green-600">{selectedPlace.address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaceAutocomplete;