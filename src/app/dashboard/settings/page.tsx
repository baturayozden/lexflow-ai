'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

export default function DashboardSettingsPage() {
  const { data: session } = useSession()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')

    const res = await fetch('/api/users/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (res.ok) {
      setMessage('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } else {
      const err = await res.json()
      setError(err.error || 'Failed to change password')
    }
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-white font-bold text-xl mb-8">Account Settings</h1>

      <div className="bg-white/2 border border-white/10 rounded-xl p-6 mb-6">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Your Profile</p>
        <div className="space-y-2">
          <div><span className="text-white/40 text-sm">Name: </span><span className="text-white text-sm">{session?.user?.name}</span></div>
          <div><span className="text-white/40 text-sm">Email: </span><span className="text-white text-sm">{session?.user?.email}</span></div>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <div><span className="text-white/40 text-sm">Firm: </span><span className="text-white text-sm">{(session?.user as any)?.firmName}</span></div>
        </div>
      </div>

      <div className="bg-white/2 border border-white/10 rounded-xl p-6">
        <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-wider mb-4">Change Password</p>
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="text-white/40 text-xs block mb-1.5">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
          </div>
          <div>
            <label className="text-white/40 text-xs block mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
          </div>
          <div>
            <label className="text-white/40 text-xs block mb-1.5">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#c9a84c]/50" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          <button type="submit" disabled={loading} className="bg-[#c9a84c] text-[#0a1628] font-bold px-6 py-2.5 rounded-lg text-sm hover:bg-[#f0d080] transition-colors disabled:opacity-50">
            {loading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
