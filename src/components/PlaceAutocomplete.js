import React, { useEffect, useRef } from 'react';

function PlaceAutocomplete({ onSelect }) {
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

  return <div ref={autocompleteRef} />;
}

export default PlaceAutocomplete;