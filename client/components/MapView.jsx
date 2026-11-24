import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

if (typeof window !== 'undefined') {
  // Fix for default markers in Next.js
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/marker-icon-2x.png',
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
  });
}

export default function MapView({ shops, userLocation, height = '400px' }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const defaultLocation = userLocation || { lat: -1.2921, lng: 36.8219 };
    
    mapInstanceRef.current = L.map(mapRef.current).setView(
      [defaultLocation.lat, defaultLocation.lng],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(mapInstanceRef.current);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'user-marker',
          html: '<div style="background: #3B82F6; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>'
        })
      }).addTo(mapInstanceRef.current);
      
      userMarker.bindPopup('Your Location');
      markersRef.current.push(userMarker);
    }

    // Add shop markers
    shops.forEach(shop => {
      const marker = L.marker([shop.latitude, shop.longitude], {
        icon: L.divIcon({
          className: 'shop-marker',
          html: `<div style="background-color: #22c55e; width: 24px; height: 24px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 2px solid white; display: flex; align-items: center; justify-center: center; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);">
                  <div style="background-color: white; width: 8px; height: 8px; border-radius: 50%; transform: rotate(45deg);"></div>
                </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 24],
          popupAnchor: [0, -24]
        })
      }).addTo(mapInstanceRef.current);
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${shop.name}</h3>
          <p style="margin-bottom: 4px;">${shop.address}</p>
          <p style="margin-bottom: 8px;">
            Rating: ${'★'.repeat(Math.round(shop.rating))} (${shop.totalReviews} reviews)
          </p>
          <a href="/shop/${shop.id}" 
             style="display: inline-block; background: #3B82F6; color: white; padding: 4px 12px; border-radius: 4px; text-decoration: none;">
            View Shop
          </a>
        </div>
      `);
      
      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds(), {
        padding: [50, 50]
      });
    }
  }, [shops, userLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%', borderRadius: '0.5rem' }}
      className="shadow-lg"
    />
  );
}