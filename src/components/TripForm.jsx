import { useState } from 'react'

const API = import.meta.env.VITE_API_BASE || 'https://eld-planner-back-end.onrender.com/'

export default function TripForm({onPlanned}){
  const [form, setForm] = useState({
    current_location: '',
    pickup_location: '',
    dropoff_location: '',
    current_cycle_used_hours: 0
  })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  const change = e => setForm(prev => ({...prev, [e.target.name]: e.target.value}))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr(null)
    try{
      const r = await fetch(`${API}/plan-trip/`, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      if(!r.ok) throw new Error(`HTTP ${r.status}`)
      const data = await r.json()
      onPlanned(data)
    }catch(ex){
      setErr(ex.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <div className="grid">
        <label>Current location
          <input name="current_location" value={form.current_location} onChange={change} required/>
        </label>
        <label>Pickup location
          <input name="pickup_location" value={form.pickup_location} onChange={change} required/>
        </label>
        <label>Dropoff location
          <input name="dropoff_location" value={form.dropoff_location} onChange={change} required/>
        </label>
        <label>Current cycle used (hrs)
          <input name="current_cycle_used_hours" type="number" step="0.1" min="0" value={form.current_cycle_used_hours} onChange={change} required/>
        </label>
      </div>
      <button disabled={loading}>{loading?'Planning...':'Plan Trip'}</button>
      {err && <p className="error">{err}</p>}
    </form>
  )
}
