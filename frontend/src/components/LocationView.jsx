import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { format, parseISO } from 'date-fns';
import { ShieldAlert } from 'lucide-react';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
const GEO_DICT = {
  'tehran': [35.6892, 51.3890],
  'tel aviv': [32.0853, 34.7818],
  'jerusalem': [31.7683, 35.2137],
  'washington': [38.9072, -77.0369],
  'gaza': [31.5017, 34.4668],
  'beirut': [33.8938, 35.5018],
  'damascus': [33.5138, 36.2765],
  'sanaa': [15.3694, 44.1910],
  'red sea': [22.0, 38.0],
  'golan heights': [33.0597, 35.8056],
  'west bank': [32.0, 35.25],
  'rafah': [31.2803, 34.2435],
  'strait of hormuz': [26.5667, 56.2500],
  'gulf of aden': [12.0, 48.0],
  'iran': [32.4279, 53.6880],
  'israel': [31.0461, 34.8516],
  'lebanon': [33.8547, 35.8623],
  'syria': [34.8021, 38.9968],
  'yemen': [15.5527, 48.5164]
};

export default function LocationView({ events, isDarkMode }) { 
  const mapMarkers = useMemo(() => {
    const markers = [];
    
    events.forEach(ev => {
      if (!ev.location_text || ev.location_text.toLowerCase() === 'unknown') return;
      
      const locKey = ev.location_text.toLowerCase().trim();
      const coords = GEO_DICT[locKey];
      
      if (coords) {
      
        const offsetLat = coords[0] + (Math.random() - 0.5) * 0.05;
        const offsetLng = coords[1] + (Math.random() - 0.5) * 0.05;
        
        markers.push({
          ...ev,
          lat: offsetLat,
          lng: offsetLng,
          isHighSeverity: ev.severity_score >= 8
        });
      }
    });
    
    return markers;
  }, [events]);

 
  const mapCenter = [31.0, 40.0]; 

  return (
    <div className="bg-white dark:bg-panel rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col h-full max-h-[800px] shadow-sm dark:shadow-none transition-colors relative z-0">
      
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Geospatial Incident Map</h2>
      </div>

      <div className="flex-grow w-full h-full min-h-[400px] z-0 relative">
        <MapContainer 
          center={mapCenter} 
          zoom={4} 
          scrollWheelZoom={true} 
          className="w-full h-full rounded-b-xl z-0"
        >

          <TileLayer
            key={isDarkMode ? 'dark-tiles' : 'light-tiles'} 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={
              isDarkMode 
                ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png"
                : "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png" 
            }
          />
          
          {mapMarkers.map((marker, idx) => (
            <Marker 
              key={idx} 
              position={[marker.lat, marker.lng]}
              icon={marker.isHighSeverity ? redIcon : new L.Icon.Default()}
            >
              <Popup className="custom-popup">
                <div className="flex flex-col gap-2 max-w-[250px]">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-800">{marker.location_text}</span>
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${marker.isHighSeverity ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      Severity: {marker.severity_score}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {marker.claim_text}
                  </p>
                  <div className="flex justify-between items-center mt-1 pt-2 border-t text-xs text-slate-500">
                    <span>{marker.actor_1}</span>
                    <span>{marker.event_datetime_utc ? format(parseISO(marker.event_datetime_utc), 'MMM dd, HH:mm') : ''}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
