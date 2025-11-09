import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "../../node_modules/leaflet/dist/images/marker-icon.png";

export default function SimpleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const latitude = 22;
  const longitude = 105;

  // Function to display marker on the map
  const displayMarker = (lat: number, lng: number, popupText?: string, options?: L.MarkerOptions): L.Marker | null => {
    if (!mapInstanceRef.current) {
      return null;
    }

    L.Marker.prototype.setIcon(L.icon({
      iconUrl: markerIcon
    }))
    const marker = L.marker([lat, lng], options).addTo(mapInstanceRef.current);
    
    if (popupText) {
      marker.bindPopup(popupText);
    }

    return marker;
  };

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Initialize map
      const map = L.map(mapRef.current, {
        attributionControl: false
      }).setView([latitude, longitude], 13);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    // Listen for coordinates from gRPC server via IPC
    let ipcRenderer: any = null;
    if (typeof window !== 'undefined' && (window as any).require) {
      try {
        const electron = (window as any).require('electron');
        ipcRenderer = electron.ipcRenderer;
      } catch (error) {
        console.warn('Electron IPC not available:', error);
      }
    }

    const handleCoordinateReceived = (_event: any, data: { latitude: number; longitude: number; message?: string; timestamp?: number }) => {
      if (data.latitude && data.longitude) {
        const popupText = data.message || `${data.latitude}, ${data.longitude}`;
        displayMarker(data.latitude, data.longitude, popupText);
      }
    };

    if (ipcRenderer) {
      ipcRenderer.on('coordinate-received', handleCoordinateReceived);
    }

    // Cleanup function
    return () => {
      if (ipcRenderer) {
        ipcRenderer.removeListener('coordinate-received', handleCoordinateReceived);
      }
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div id="map" ref={mapRef} style={{ height: "100%", width: "100%" }} />
  );
}
