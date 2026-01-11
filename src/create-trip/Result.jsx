import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Result() {
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let raw = localStorage.getItem('tripResult');
    if (!raw) {
      setError('No trip data found');
      return;
    }

    try {
      // Strip markdown code fences and any text before/after JSON
      const startIdx = raw.indexOf('{');
      const endIdx = raw.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
        raw = raw.slice(startIdx, endIdx + 1);
      }
      raw = raw.replace(/```json|```/g, '');
      if (raw.startsWith('"') && raw.endsWith('"')) {
        raw = raw.slice(1, -1);
      }
      raw = raw.replace(/\\"/g, '"').replace(/\\n/g, '');

      const parsed = JSON.parse(raw);

      // Use the consistent structure from AIModal
      const plan = {
        location: parsed.location,
        durationDays: parsed.duration_days,
        travelerCount: parsed.traveler_count,
        budget: parsed.budget,
        hotels: (parsed.hotels || []).map(h => ({
          name: h.hotel_name,
          address: h.hotel_address,
          price: h.price_per_night,
          imageUrl: h.hotel_image_url,
          geo: h.geo_coordinates,
          rating: h.rating,
          description: h.description
        })),
        itinerary: (parsed.itinerary || []).map(dayObj => ({
          day: dayObj.day,
          theme: dayObj.theme,
          activities: (dayObj.activities || []).map(activity => ({
            placeName: activity.place_name,
            placeLink: activity.place_link,
            details: activity.place_details,
            imageUrl: activity.place_image_url,
            geo: activity.geo_coordinates,
            ticket: activity.ticket_pricing,
            rating: activity.rating,
            timeToVisit: activity.time_to_visit_hours,
            bestTime: activity.best_time_to_visit,
            contactNumber: activity.contact_number
          }))
        }))
      };

      setPlan(plan);
    } catch (err) {
      console.error('Parsing Error:', err);
      setError('Failed to parse trip data');
    }
  }, []);

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/create-trip')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-6 sm:mt-10 p-4 sm:p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{plan.location}</h1>
        <p className="text-gray-600 text-center sm:text-left">{plan.durationDays} days · {plan.travelerCount} traveler(s) · {plan.budget}</p>
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center sm:text-left">Hotels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plan.hotels?.map((hotel, idx) => (
          <div key={idx} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
            <div className="font-bold text-lg">{hotel.name}</div>
            {hotel.rating && <div className="text-yellow-600 text-sm">⭐ {hotel.rating}</div>}
            {hotel.address && <div className="text-gray-600 text-sm mt-1">{hotel.address}</div>}
            {hotel.price != null && <div className="text-green-600 font-semibold mt-1">₹{hotel.price}</div>}
            {hotel.description && <div className="text-gray-700 text-sm mt-2">{hotel.description}</div>}
          </div>
        ))}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-center sm:text-left">Itinerary</h2>
      {plan.itinerary.map((day, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-lg sm:text-xl font-semibold mb-3 text-center sm:text-left">Day {day.day}: {day.theme}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {day.activities.map((activity, idx) => (
              <div key={idx} className="p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                <a href={activity.placeLink} target="_blank" rel="noopener noreferrer" className="block">
                  <div className="font-semibold text-blue-800 hover:text-blue-600 transition-colors">{activity.placeName}</div>
                </a>
                <div className="text-sm text-gray-600 mt-2">{activity.details}</div>
                <div className="text-xs text-gray-500 mt-2 flex flex-wrap gap-2">
                  {activity.rating && <span className="bg-yellow-100 px-2 py-1 rounded">⭐ {activity.rating}</span>}
                  {activity.ticket > 0 && <span className="bg-green-100 px-2 py-1 rounded">₹{activity.ticket}</span>}
                  {activity.timeToVisit && <span className="bg-blue-100 px-2 py-1 rounded">{activity.timeToVisit}h</span>}
                  {activity.bestTime && <span className="bg-purple-100 px-2 py-1 rounded">{activity.bestTime}</span>}
                  {activity.contactNumber && <span className="bg-red-100 px-2 py-1 rounded">{activity.contactNumber}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Result;