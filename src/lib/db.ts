import { supabaseAdmin } from './supabase'

export async function saveLead(data: {
  name: string
  firm_name: string
  email: string
  phone?: string
  firm_type: string
  message?: string
}) {
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .insert([{ ...data, status: 'new', source: 'contact_form' }])
    .select()
    .single()
  if (error) throw error
  return lead
}

export async function saveCase(data: {
  client_name: string
  client_email: string
  client_phone?: string
  nationality: string
  visa_type: string
  visa_expiry?: string
  case_type: string
  description: string
  ai_summary: string
  ip?: string
  city?: string
  country?: string
  reference_id: string
}) {
  const { data: caseRecord, error } = await supabaseAdmin
    .from('cases')
    .insert([{ ...data, status: 'new' }])
    .select()
    .single()
  if (error) throw error
  return caseRecord
}

export async function getLeads() {
  const { data, error } = await supabaseAdmin
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCases() {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}
