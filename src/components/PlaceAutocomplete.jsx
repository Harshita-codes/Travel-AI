import React, { useEffect, useRef } from 'react';

function PlaceAutocomplete({ onSelect }) {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_PLACE_API_KEY}&libraries=places&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;

    const placeAutocomplete = new window.google.maps.places.PlaceAutocompleteElement();

    placeAutocomplete.addEventListener('gmp-select', async (event) => {
      const place = event.placePrediction.toPlace();
      await place.fetchFields({
        fields: ['displayName', 'formattedAddress', 'location'],
      });
      if (onSelect) onSelect(place);
    });

    if (autocompleteRef.current) {
      autocompleteRef.current.innerHTML = '';
      autocompleteRef.current.appendChild(placeAutocomplete);
    }
  }, []);

  return (
    <div ref={autocompleteRef} className="gmp-autocomplete"></div>
  );
}

export default PlaceAutocomplete;