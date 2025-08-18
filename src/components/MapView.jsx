import { useEffect, useRef } from 'react'
import L from 'leaflet'
import polyline from 'polyline'

export default function MapView({plan}){
  const ref = useRef(null)
  const mapRef = useRef(null)

  useEffect(() => {
    if(!ref.current) return
    if(!mapRef.current){
      mapRef.current = L.map(ref.current).setView([39.5, -98.35], 4)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(mapRef.current)
    }
    // remove markers & lines but keep tile layer
    const toRemove = []
    mapRef.current.eachLayer(l => { if(l instanceof L.Polyline || l instanceof L.Marker) toRemove.push(l) })
    toRemove.forEach(l => mapRef.current.removeLayer(l))

    plan.map_markers.forEach(m => {
      L.marker([m.lat, m.lon]).addTo(mapRef.current).bindPopup(m.label)
    })

    const geoms = plan.route_polyline.split('.').map(p => polyline.decode(p))
    const latlngs = geoms.flat().map(([lat, lon]) => [lat, lon])
    const line = L.polyline(latlngs).addTo(mapRef.current)
    mapRef.current.fitBounds(line.getBounds())
  }, [plan])

  return <div ref={ref} style={{height:'420px', border:'1px solid #ddd', borderRadius:8, marginTop:12}}/>
}
