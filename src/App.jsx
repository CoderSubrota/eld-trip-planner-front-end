import { useState } from 'react'
import TripForm from './components/TripForm.jsx'
import MapView from './components/MapView.jsx'
import ELDLog from './components/ELDLog.jsx'

export default function App(){
  const [plan, setPlan] = useState(null)
  return (
    <div className="app">
      <h1>ELD Trip Planner</h1>
      <TripForm onPlanned={setPlan}/>
      {plan && (
        <>
          <section className="stats">
            <div>Distance: {plan.distance_miles} mi</div>
            <div>Driving Time: {plan.driving_hours} hrs</div>
          </section>
          <MapView plan={plan}/>
          <ELDLog dayPlans={plan.day_plans}/>
        </>
      )}
    </div>
  )
}
