'use client'
import { useState } from 'react'

export default function ContactForm() {
  const [clicked, setClicked] = useState(false)

  return (
    <div style={{ padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
      <form onSubmit={(e) => { e.preventDefault(); console.log('FORM SUBMITTED'); setClicked(true); }}>
        <input type="text" placeholder="Test input" style={{ display: 'block', marginBottom: '10px', padding: '8px', color: 'black' }} />
        <button type="submit" style={{ background: '#c9a84c', color: '#0a1628', padding: '12px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>
          TEST SUBMIT
        </button>
      </form>
      {clicked && <p style={{ color: 'green', marginTop: '10px' }}>✓ IT WORKS</p>}
    </div>
  )
}
