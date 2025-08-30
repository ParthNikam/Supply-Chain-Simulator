"use client";

import { useEffect, useRef, useState } from "react";

const DashboardPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map>(null);
  const markers = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const directionsRenderer = useRef<google.maps.DirectionsRenderer>(null);
  const directionsService = useRef<google.maps.DirectionsService>(null);

  const [googleReady, setGoogleReady] = useState(false);

  // load google map
  useEffect(() => {
    // Dynamically load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyClPBWQoF6cb9mOS12f0rmhKeYYHIIPhII&libraries=marker,places`;
    script.async = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);


  // Initialize map once Google is ready
  useEffect(() => {
    if (!googleReady || !mapRef.current) return;

    const map = new google.maps.Map(mapRef.current, {
      center: { lat: 37.7749, lng: -122.4194 }, // SF
      zoom: 12,
      mapId: "DEMO_MAP_ID",
    });
    mapInstance.current = map;

    // Add click listener to place markers
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;
      placeMarker(e.latLng, map);
    });

    directionsRenderer.current = new google.maps.DirectionsRenderer();
    directionsService.current = new google.maps.DirectionsService();
    directionsRenderer.current.setMap(map);
  }, [googleReady]);


  // Place Advanced Marker
  const placeMarker = (position: google.maps.LatLng) => {
    // Reset markers if two already placed
    if (markers.current.length >= 2) {
      markers.current.forEach((m) => (m.map = null));
      markers.current = [];
      directionsRenderer.current?.setDirections({ routes: [] });
    }

    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: mapInstance.current!,
      position,
    });

    markers.current.push(marker);
  };


  // Calculate route
  const findShortestPath = () => {
    if (markers.current.length < 2) {
      alert("Please select two points first");
      return;
    }

    const origin = markers.current[0].position;
    const destination = markers.current[1].position;
    if (!origin || !destination) return;

    directionsService.current?.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          directionsRenderer.current?.setDirections(result);
        } else {
          alert("Could not calculate route");
        }
      }
    );
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Simulator Dashboard</h1>

      <div className="grid grid-cols-4 gap-2">
        <div className="flex flex-col p-4 col-span-1 border border-1">
           <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={findShortestPath}
            >
              Find Shortest Path
            </button>
            <p className="text-sm text-gray-600">
              Click two points on the map, then press this button.
            </p>
        </div>
        <div className="col-span-3 border border-1">
          <div ref={mapRef} className="w-full h-[600px]" />
        </div>

        <div className="col-start-2 col-span-2 border border-1">info</div>
      </div>
    </div>
  );
};

export default DashboardPage;
