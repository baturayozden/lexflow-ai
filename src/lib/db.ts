import { supabaseAdmin } from './supabase'

export async function saveLead(data: {
  name: string
  firm_name: string
  email: string
  phone?: string
  firm_type: string
  message?: string
  firm_id?: string | null
}) {
  const { data: lead, error } = await supabaseAdmin
    .from('leads')
    .insert([{ ...data, status: 'new', source: data.firm_id ? 'manual' : 'contact_form' }])
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
  firm_id?: string | null
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
    .is('firm_id', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCases() {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name, email, role)')
    .is('firm_id', null)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getCasesWithActions() {
  const { data, error } = await supabaseAdmin
    .from('cases')
    .select('*, team_members(name, email, role), case_actions(*)')
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

export async function updateTeamMember(id: string, data: { name?: string; email?: string; role?: string }) {
  const { data: member, error } = await supabaseAdmin
    .from('team_members')
    .update(data)
    .eq('id', id)
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

export async function getCaseActions(caseId: string) {
  const { data, error } = await supabaseAdmin
    .from('case_actions')
    .select('*')
    .eq('case_id', caseId)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function saveCaseActions(
  caseId: string,
  steps: { step: string; type: string; urgency: string }[]
) {
  await supabaseAdmin.from('case_actions').delete().eq('case_id', caseId)
  if (!steps.length) return []
  const { data, error } = await supabaseAdmin
    .from('case_actions')
    .insert(steps.map((s, i) => ({ case_id: caseId, ...s, sort_order: i })))
    .select()
  if (error) throw error
  return data
}

export async function updateCaseAction(
  actionId: string,
  completed: boolean,
  completedBy?: string
) {
  const { error } = await supabaseAdmin
    .from('case_actions')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
      completed_by: completed ? (completedBy || 'Admin') : null,
    })
    .eq('id', actionId)
  if (error) throw error
}

// ── Settings ─────────────────────────────────────────────────────────────────

export async function getFirmSettings() {
  const { data } = await supabaseAdmin.from('firm_settings').select('*').single()
  return data || { firm_name: 'LexFlow', primary_color: '#c9a84c' }
}

export async function updateFirmSettings(settings: Record<string, unknown>) {
  const existing = await supabaseAdmin.from('firm_settings').select('id').single()
  if (existing.data) {
    const { data } = await supabaseAdmin
      .from('firm_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.data.id)
      .select()
      .single()
    return data
  } else {
    const { data } = await supabaseAdmin.from('firm_settings').insert([settings]).select().single()
    return data
  }
}

export async function getEmailSettings() {
  const { data } = await supabaseAdmin.from('email_settings').select('*').single()
  return data || { from_name: 'LexFlow', from_email: 'notifications@lexflow.co.uk' }
}

export async function updateEmailSettings(settings: Record<string, unknown>) {
  const existing = await supabaseAdmin.from('email_settings').select('id').single()
  if (existing.data) {
    const { data } = await supabaseAdmin
      .from('email_settings')
      .update({ ...settings, updated_at: new Date().toISOString() })
      .eq('id', existing.data.id)
      .select()
      .single()
    return data
  } else {
    const { data } = await supabaseAdmin.from('email_settings').insert([settings]).select().single()
    return data
  }
}

export async function getChecklistTemplates() {
  const { data, error } = await supabaseAdmin.from('checklist_templates').select('*').order('case_type')
  if (error) throw error
  return data
}

export async function getChecklistByType(caseType: string) {
  const { data } = await supabaseAdmin
    .from('checklist_templates')
    .select('*')
    .eq('case_type', caseType)
    .single()
  return data
}

export async function updateChecklistTemplate(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('checklist_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getQuoteTemplates() {
  const { data, error } = await supabaseAdmin.from('quote_templates').select('*').order('case_type')
  if (error) throw error
  return data
}

export async function getQuoteByType(caseType: string) {
  const { data } = await supabaseAdmin
    .from('quote_templates')
    .select('*')
    .eq('case_type', caseType)
    .single()
  return data
}

export async function updateQuoteTemplate(id: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('quote_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getEmailTemplate(type: string) {
  const { data } = await supabaseAdmin
    .from('email_templates')
    .select('*')
    .eq('template_type', type)
    .single()
  return data
}

export async function updateEmailTemplate(type: string, updates: Record<string, unknown>) {
  const { data, error } = await supabaseAdmin
    .from('email_templates')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('template_type', type)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── Checklist Reviews ─────────────────────────────────────────────────────────

export async function getChecklistReviews(status?: string) {
  let query = supabaseAdmin
    .from('checklist_reviews')
    .select('*, checklist_templates(case_type, title)')
  if (status) query = query.eq('status', status)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createChecklistReview(data: {
  checklist_id: string
  case_type: string
  current_items: unknown[]
  proposed_items: unknown[]
  changes_summary: string
  gov_url: string
}) {
  const { data: review, error } = await supabaseAdmin
    .from('checklist_reviews')
    .insert([{ ...data, status: 'pending' }])
    .select()
    .single()
  if (error) throw error
  return review
}

export async function approveChecklistReview(reviewId: string) {
  const { data: review, error: fetchError } = await supabaseAdmin
    .from('checklist_reviews')
    .select('*')
    .eq('id', reviewId)
    .single()
  if (fetchError) throw fetchError

  await supabaseAdmin
    .from('checklist_templates')
    .update({
      items: review.proposed_items,
      last_reviewed_at: new Date().toISOString(),
    })
    .eq('id', review.checklist_id)

  const { data, error } = await supabaseAdmin
    .from('checklist_reviews')
    .update({ status: 'approved', reviewed_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function rejectChecklistReview(reviewId: string) {
  const { data, error } = await supabaseAdmin
    .from('checklist_reviews')
    .update({ status: 'rejected', reviewed_at: new Date().toISOString() })
    .eq('id', reviewId)
    .select()
    .single()
  if (error) throw error
  return data
}
