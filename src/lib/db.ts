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
  visa_expiry?: string | null
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
    .select('*, team_members(name, email, role)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCases() {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name, email, role)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getTeamMembers() {
  const { data, error } = await supabaseAdmin
    .from('team_members')
    .select('*')
    .eq('active', true)
    .order('name')
  if (error) throw error
  return data
}

export async function addTeamMember(data: { name: string; email: string; role: string }) {
  const { data: member, error } = await supabaseAdmin
    .from('team_members')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return member
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabaseAdmin
    .from('team_members')
    .update({ active: false })
    .eq('id', id)
  if (error) throw error
}

export async function assignLead(leadId: string, memberId: string | null) {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ assigned_to: memberId })
    .eq('id', leadId)
  if (error) throw error
}

export async function assignCase(caseId: string, memberId: string | null) {
  const { error } = await supabaseAdmin
    .from('cases')
    .update({ assigned_to: memberId })
    .eq('id', caseId)
  if (error) throw error
}

export async function softDeleteLead(id: string) {
  const { error } = await supabaseAdmin
    .from('leads')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function softDeleteCase(id: string) {
  const { error } = await supabaseAdmin
    .from('cases')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function getNotes(entityType: string, entityId: string) {
  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function addNote(data: {
  entity_type: string
  entity_id: string
  content: string
  author: string
}) {
  const { data: note, error } = await supabaseAdmin
    .from('notes')
    .insert([data])
    .select()
    .single()
  if (error) throw error
  return note
}
