import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Star } from 'lucide-react'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

function MapController({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.8 })
  }, [center, zoom, map])
  return null
}

function RestaurantPopup({ restaurant }) {
  const navigate = useNavigate()

  return (
    <div
      className="p-3 min-w-[200px] cursor-pointer"
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
    >
      <img
        src={restaurant.cover}
        alt={restaurant.name}
        className="w-full h-24 object-cover rounded-lg mb-2"
      />
      <h4 className="font-semibold text-sm text-text">{restaurant.name}</h4>
      <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
        <span className="flex items-center gap-0.5">
          <Star className="w-3 h-3 text-accent fill-accent" />
          {restaurant.rating}
        </span>
        <span>¥{restaurant.avgPrice}/人</span>
        <span>{restaurant.cuisine}</span>
      </div>
    </div>
  )
}

export default function MapView({ className = '' }) {
  const { filteredRestaurants, selectedSchool } = useApp()

  return (
    <div className={`rounded-2xl overflow-hidden border border-border ${className}`}>
      <MapContainer
        center={[selectedSchool.lat, selectedSchool.lng]}
        zoom={selectedSchool.zoom}
        className="h-full w-full"
        style={{ minHeight: '300px' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          center={[selectedSchool.lat, selectedSchool.lng]}
          zoom={selectedSchool.zoom}
        />
        {filteredRestaurants.map(r => (
          <Marker key={r.id} position={[r.lat, r.lng]} icon={redIcon}>
            <Popup>
              <RestaurantPopup restaurant={r} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
