import { supabaseAdmin } from './supabase'
import bcrypt from 'bcryptjs'

export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*, firms(id, name, plan, active, primary_color)')
    .eq('email', email)
    .eq('active', true)
    .single()
  if (error) return null
  return data
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function updateLastLogin(userId: string) {
  await supabaseAdmin
    .from('users')
    .update({ last_login_at: new Date().toISOString() })
    .eq('id', userId)
}

export async function getFirmBySlug(slug: string) {
  const { data, error } = await supabaseAdmin
    .from('firms')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()
  if (error) return null
  return data
}

export async function createFirm(data: {
  name: string
  email?: string
  phone?: string
  plan?: string
  address?: string
}) {
  const slug = data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  const { data: firm, error } = await supabaseAdmin
    .from('firms')
    .insert([{ ...data, slug }])
    .select()
    .single()
  if (error) throw error
  return firm
}

export async function getFirms() {
  const { data, error } = await supabaseAdmin
    .from('firms')
    .select('*, users(count), payments(amount, status, payment_type)')
    .neq('plan', 'platform')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getFirmById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('firms')
    .select('*')
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createUser(data: {
  firm_id: string
  name: string
  email: string
  password: string
  role: string
}) {
  const password_hash = await hashPassword(data.password)
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .insert([{
      firm_id: data.firm_id,
      name: data.name,
      email: data.email,
      password_hash,
      role: data.role,
    }])
    .select()
    .single()
  if (error) throw error
  return user
}

export async function getUsersByFirm(firmId: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, name, email, role, active, last_login_at, created_at')
    .eq('firm_id', firmId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function updateUser(
  id: string,
  data: { name?: string; email?: string; role?: string; active?: boolean }
) {
  const { data: user, error } = await supabaseAdmin
    .from('users')
    .update(data)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return user
}

export async function updateUserPassword(id: string, password: string) {
  const password_hash = await hashPassword(password)
  await supabaseAdmin.from('users').update({ password_hash }).eq('id', id)
}

export async function deleteUser(id: string) {
  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Payments ──────────────────────────────────────────────────────────────────

export async function getPaymentsByFirm(firmId: string) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .select('*')
    .eq('firm_id', firmId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addPayment(data: {
  firm_id: string
  amount: number
  currency?: string
  payment_type?: string
  status?: string
  description?: string
  paid_at?: string
  due_at?: string
}) {
  const { data: payment, error } = await supabaseAdmin
    .from('payments')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return payment
}

export async function updatePaymentStatus(id: string, status: string) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .update({ status, paid_at: status === 'paid' ? new Date().toISOString() : null })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Firm Notes ────────────────────────────────────────────────────────────────

export async function getFirmNotes(firmId: string) {
  const { data, error } = await supabaseAdmin
    .from('firm_notes')
    .select('*')
    .eq('firm_id', firmId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function addFirmNote(firmId: string, content: string, author: string) {
  const { data, error } = await supabaseAdmin
    .from('firm_notes')
    .insert([{ firm_id: firmId, content, author }])
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Firm Stats ────────────────────────────────────────────────────────────────

export async function getFirmStats(firmId: string) {
  const [casesRes, actionsRes, usersRes] = await Promise.all([
    supabaseAdmin.from('cases').select('id, created_at, status').eq('firm_id', firmId).is('deleted_at', null),
    supabaseAdmin.from('case_actions').select('id, completed, case_id'),
    supabaseAdmin.from('users').select('id, active').eq('firm_id', firmId),
  ])

  const cases = casesRes.data || []
  const allActions = actionsRes.data || []
  const users = usersRes.data || []

  const caseIds = new Set(cases.map(c => c.id))
  const firmActions = allActions.filter(a => caseIds.has(a.case_id))

  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const casesThisMonth = cases.filter(c => new Date(c.created_at) > monthAgo).length

  return {
    totalCases: cases.length,
    casesThisMonth,
    totalActions: firmActions.length,
    completedActions: firmActions.filter(a => a.completed).length,
    activeUsers: users.filter(u => u.active).length,
    aiCallsEstimate: cases.length + firmActions.filter(a => a.completed).length,
  }
}

// ── Seed ──────────────────────────────────────────────────────────────────────

export async function seedSuperAdmin() {
  const password_hash = await hashPassword(process.env.ADMIN_PASSWORD || 'LexFlow2026!')
  const email = process.env.ADMIN_EMAIL || 'baturay@lexflow.co.uk'

  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert([{
      id: '00000000-0000-0000-0000-000000000002',
      firm_id: '00000000-0000-0000-0000-000000000001',
      name: 'Baturay Ozden',
      email: email,
      password_hash,
      role: 'platform_admin',
    }], { onConflict: 'id' })
    .select()
    .single()

  if (error) throw error
  return data
}
