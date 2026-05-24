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

export async function createFirm(data: {
  name: string
  email?: string
  phone?: string
  plan?: string
}) {
  const { data: firm, error } = await supabaseAdmin
    .from('firms')
    .insert([{ ...data }])
    .select()
    .single()
  if (error) throw error
  return firm
}

export async function getFirms() {
  const { data, error } = await supabaseAdmin
    .from('firms')
    .select('*, users(count)')
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

export async function seedSuperAdmin() {
  const existing = await getUserByEmail(
    process.env.ADMIN_EMAIL || 'baturay@lexflow.co.uk'
  )
  if (existing) return existing

  const password_hash = await hashPassword(
    process.env.ADMIN_PASSWORD || 'LexFlow2026!'
  )
  const { data, error } = await supabaseAdmin
    .from('users')
    .upsert(
      [
        {
          id: '00000000-0000-0000-0000-000000000002',
          firm_id: '00000000-0000-0000-0000-000000000001',
          name: 'Baturay Ozden',
          email: process.env.ADMIN_EMAIL || 'baturay@lexflow.co.uk',
          password_hash,
          role: 'platform_admin',
        },
      ],
      { onConflict: 'id' }
    )
    .select()
    .single()
  if (error) throw error
  return data
}
