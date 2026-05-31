#!/usr/bin/env node
'use strict'

/**
 * Hartley & Moore Solicitors — comprehensive demo seed
 * Runs against Supabase REST API using service-role key.
 *
 * Usage:  node scripts/seed-demo.js
 * Env:    NEXT_PUBLIC_SUPABASE_URL  +  SUPABASE_SERVICE_ROLE_KEY  (from .env.local)
 */

require('dotenv').config({ path: '.env.local' })
const bcrypt = require('bcryptjs')

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '')
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  Missing env vars.\n    Need NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// ─── REST helpers ──────────────────────────────────────────────────────────────

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  Authorization:  `Bearer ${SERVICE_KEY}`,
  apikey:         SERVICE_KEY,
  ...extra,
})

async function insert(table, rows) {
  const body = Array.isArray(rows) ? rows : [rows]
  const res  = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method:  'POST',
    headers: headers({ Prefer: 'return=representation' }),
    body:    JSON.stringify(body),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`[INSERT ${table}] ${res.status}: ${text}`)
  return JSON.parse(text) // always an array
}

async function del(table, query) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${query}`, {
    method:  'DELETE',
    headers: headers({ Prefer: 'return=representation' }),
  })
  const text = await res.text()
  if (!res.ok && res.status !== 404) throw new Error(`[DELETE ${table}] ${res.status}: ${text}`)
  const data = text ? JSON.parse(text) : []
  return Array.isArray(data) ? data.length : 0
}

async function query(table, params) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: headers(),
  })
  const text = await res.text()
  if (!res.ok) throw new Error(`[GET ${table}] ${res.status}: ${text}`)
  return JSON.parse(text)
}

function step(n, msg)  { console.log(`\n${'─'.repeat(52)}\n  STEP ${n}: ${msg}\n${'─'.repeat(52)}`) }
function ok(msg)       { console.log(`  ✓  ${msg}`) }
function info(msg)     { console.log(`  ·  ${msg}`) }

// ─── seed data ────────────────────────────────────────────────────────────────

const CASES_DEF = [
  {
    reference_id:  'HM-2026-001',
    client_name:   'Alessandro Romano',
    client_email:  'a.romano@example.com',
    client_phone:  '+39 333 1234567',
    nationality:   'Italian',
    visa_type:     'Skilled Worker Visa',
    case_type:     'skilled_worker_visa',
    status:        'in_progress',
    description:   'Extension of Skilled Worker visa for Senior Software Engineer at TechNorth Ltd, Manchester.',
    assigned_email:'william.moore@hartleymoore.co.uk',
    ai_summary:    'Alessandro Romano, 34, Italian national currently on a Tier 2 General visa expiring 15 August 2026. Employed as Senior Software Engineer at TechNorth Ltd, Manchester (A-rated sponsor). Salary £67,500 pa — well above skilled worker threshold. Requires urgent extension application. CoS issued 3 March 2026. English language satisfied via degree certificate (University of Bologna, taught in English). No adverse immigration history. Straightforward application with good prospects of success.',
    actions: [
      { step: 'Request updated CoS confirmation from TechNorth HR',                  type: 'document',   urgency: 'high',   completed: true  },
      { step: 'Verify English language evidence (Bologna degree certificate)',         type: 'check',      urgency: 'medium', completed: true  },
      { step: 'Request last 3 months payslips and P60',                              type: 'document',   urgency: 'high',   completed: false },
      { step: 'Generate and send fee quote',                                         type: 'email',      urgency: 'medium', completed: false },
      { step: 'Submit Skilled Worker visa extension application via UKVI portal',     type: 'submission', urgency: 'high',   completed: false },
    ],
    notes: [
      { content: 'Spoke with Alessandro 28 May — he has confirmed CoS received. Employer HR contact: hr@technorth.co.uk. Chasing payslips by end of week.', author: 'william.moore@hartleymoore.co.uk' },
      { content: 'Fee quote to be sent once payslips confirmed. Client is aware of urgent timeline — visa expires August.',                                  author: 'charlotte.hartley@hartleymoore.co.uk' },
    ],
  },
  {
    reference_id:  'HM-2026-002',
    client_name:   'Elena Kowalski',
    client_email:  'e.kowalski@example.com',
    client_phone:  '+48 600 234567',
    nationality:   'Polish',
    visa_type:     'Family Reunion Visa',
    case_type:     'family_reunion_visa',
    status:        'awaiting_documents',
    description:   'Family reunion visa application to join British citizen spouse in Manchester.',
    assigned_email:'william.moore@hartleymoore.co.uk',
    ai_summary:    "Elena Kowalski, 29, Polish national applying to join her British citizen husband Daniel Kowalski (DOB 14/06/1990) in Manchester. Marriage certificate issued Warsaw, 12 September 2023. Daniel's gross income £31,200 pa (employed, Barclays payslips provided). Meets financial threshold. Awaiting English language test results — IELTS booked 18 June 2026. Accommodation: joint tenancy at 15 Beech Road, Didsbury. No previous visa refusals. Application ready to submit once language evidence received.",
    actions: [
      { step: 'Chase IELTS results — exam date 18 June 2026',       type: 'chase',    urgency: 'high',   completed: false },
      { step: 'Send document checklist to client',                   type: 'email',    urgency: 'medium', completed: true  },
      { step: 'Verify financial evidence — Daniel Kowalski payslips',type: 'check',    urgency: 'medium', completed: true  },
      { step: 'Prepare application form VAF4A',                      type: 'document', urgency: 'medium', completed: false },
    ],
    notes: [
      { content: 'Daniel Kowalski called 20 May — confirmed IELTS sitting on 18 June. Will send results within 5 days of test. Advised Elena to begin gathering relationship evidence.', author: 'william.moore@hartleymoore.co.uk' },
      { content: 'Financial evidence reviewed — salary slips and bank statements from Barclays confirm £31,200 gross. Threshold met.',                                                   author: 'marco.ferretti@hartleymoore.co.uk' },
    ],
  },
  {
    reference_id:  'HM-2026-003',
    client_name:   'James & Catherine Whitfield',
    client_email:  'whitfield.family@example.com',
    client_phone:  '+44 7700 900001',
    nationality:   'British',
    visa_type:     'Residential Purchase',
    case_type:     'residential_purchase',
    status:        'completed',
    description:   'Residential property purchase at 28 Oakfield Drive, Altrincham, WA14 2BN for £485,000.',
    assigned_email:'priya.patel@hartleymoore.co.uk',
    ai_summary:    'Completed residential purchase of 28 Oakfield Drive, Altrincham, WA14 2BN for £485,000. Mortgage with NatWest (£320,000, 25 years). All searches clear. No adverse title issues. SDLT of £12,000 paid. Legal completion 14 March 2026. Title registered at HM Land Registry under title number CH887234. File closed and documents archived.',
    actions: [
      { step: 'Review and approve draft contract',           type: 'check',      urgency: 'medium', completed: true },
      { step: 'Confirm mortgage funds received from NatWest',type: 'check',      urgency: 'high',   completed: true },
      { step: 'Submit SDLT return and payment',              type: 'submission', urgency: 'high',   completed: true },
      { step: 'Register title at HM Land Registry',         type: 'submission', urgency: 'high',   completed: true },
    ],
    notes: [],
  },
  {
    reference_id:  'HM-2026-004',
    client_name:   'Lucia Moreno',
    client_email:  'l.moreno@example.com',
    client_phone:  '+34 612 345678',
    nationality:   'Spanish',
    visa_type:     'ILR Application',
    case_type:     'indefinite_leave_to_remain',
    status:        'in_progress',
    description:   'Indefinite Leave to Remain application following 5 years on Skilled Worker visa.',
    assigned_email:'william.moore@hartleymoore.co.uk',
    ai_summary:    'Lucia Moreno, 41, Spanish national. Has resided lawfully in the UK since 14 February 2019 on a succession of Skilled Worker visas. Current visa expires 30 November 2026 — ILR application to be submitted no later than October 2026. Life in the UK test passed 8 January 2026 (score: 24/24). English language: exempt (degree from UCL). Absence record reviewed — total absences 187 days over 5 years, within permitted limit. Strong application. Employer confirmation letter requested from Deloitte Manchester.',
    actions: [
      { step: 'Request employer confirmation letter from Deloitte',     type: 'document', urgency: 'high',   completed: false },
      { step: 'Review 5-year absence record — confirm within limits',   type: 'check',    urgency: 'high',   completed: true  },
      { step: 'Confirm Life in the UK test certificate received',        type: 'document', urgency: 'medium', completed: true  },
      { step: 'Run eligibility check before submission',                type: 'check',    urgency: 'high',   completed: false },
      { step: 'Schedule follow-up call with client — week of 16 June', type: 'followup', urgency: 'medium', completed: false },
    ],
    notes: [
      { content: 'Absence calculation completed — 187 days total over qualifying period. Within the 180-day per year limit across all years.',              author: 'william.moore@hartleymoore.co.uk' },
      { content: 'Life in the UK certificate received and filed. Waiting on Deloitte employer letter — chased by email 27 May 2026.',                       author: 'isabella.ruiz@hartleymoore.co.uk' },
    ],
  },
  {
    reference_id:  'HM-2026-005',
    client_name:   'Robert & Diana Pemberton',
    client_email:  'pemberton.family@example.com',
    client_phone:  '+44 7700 900002',
    nationality:   'British',
    visa_type:     'Residential Sale',
    case_type:     'residential_sale',
    status:        'in_progress',
    description:   'Sale of residential property at 7 Willow Lane, Didsbury, M20 6PR for £620,000.',
    assigned_email:'priya.patel@hartleymoore.co.uk',
    ai_summary:    "Sale of 7 Willow Lane, Didsbury, M20 6PR for £620,000. Freehold property. Buyers' solicitors: Fletcher & Co, Leeds. Mortgage redemption figure requested from Halifax (outstanding £187,400). TA6 and TA10 forms completed and returned. Local authority search results received — no adverse entries. Awaiting draft contract approval from buyers' solicitors. Target completion: 30 June 2026.",
    actions: [
      { step: "Send TA6 and TA10 forms to buyers' solicitors",  type: 'document', urgency: 'high',   completed: true  },
      { step: 'Chase draft contract approval from Fletcher & Co',type: 'chase',   urgency: 'high',   completed: false },
      { step: 'Obtain mortgage redemption figure from Halifax',  type: 'document', urgency: 'medium', completed: true  },
      { step: 'Confirm completion date with all parties',        type: 'check',   urgency: 'high',   completed: false },
    ],
    notes: [
      { content: "Buyers' solicitors (Fletcher & Co) acknowledged receipt of TA6/TA10 on 22 May. Awaiting their pre-contract enquiries.", author: 'priya.patel@hartleymoore.co.uk'  },
      { content: 'Halifax redemption statement received — £187,400 as of 1 June 2026. Valid for 30 days.',                               author: 'oliver.bennett@hartleymoore.co.uk' },
    ],
  },
  {
    reference_id:  'HM-2026-006',
    client_name:   'Thomas Fletcher',
    client_email:  't.fletcher@student.ac.uk',
    client_phone:  '+44 7700 900003',
    nationality:   'British-Nigerian',
    visa_type:     'Student Visa Extension',
    case_type:     'student_visa_extension',
    status:        'new',
    description:   'Student visa extension to complete MSc Data Science at University of Manchester.',
    assigned_email:'marco.ferretti@hartleymoore.co.uk',
    ai_summary:    'Thomas Fletcher, 23, British-Nigerian dual national applying for a Student visa extension to complete MSc Data Science at University of Manchester. Current CAS assigned 1 April 2026. Course end date 30 September 2027. Tuition fees paid in full. Accommodation confirmed at University halls. Financial requirement: £1,334 x 9 months = £12,006 in bank for 28 consecutive days. Bank statements pending. Straightforward extension — no previous refusals.',
    actions: [
      { step: 'Request 28-day bank statements showing £12,006 minimum', type: 'document', urgency: 'high',   completed: false },
      { step: 'Verify CAS details with University of Manchester',        type: 'check',    urgency: 'medium', completed: false },
      { step: 'Send document checklist to client',                      type: 'email',    urgency: 'medium', completed: false },
    ],
    notes: [],
  },
  {
    reference_id:  'HM-2026-007',
    client_name:   'The Nakamura Family',
    client_email:  'nakamura.family@example.com',
    client_phone:  '+44 7700 900004',
    nationality:   'Japanese',
    visa_type:     'Right to Buy',
    case_type:     'right_to_buy',
    status:        'awaiting_documents',
    description:   'Right to Buy purchase of council property at 45 Rosewood Avenue, Salford, M6 8TN.',
    assigned_email:'priya.patel@hartleymoore.co.uk',
    ai_summary:    'Kenji and Yuki Nakamura exercising Right to Buy on their council property at 45 Rosewood Avenue, Salford, M6 8TN. Discount applied: £87,000 (10 years tenancy). Purchase price after discount: £178,000. Manchester City Council acting as vendor. Awaiting official Right to Buy offer notice (RTB2) from council — expected within 8 weeks of application. Mortgage offer from Nationwide pending survey. Identity verification completed.',
    actions: [
      { step: 'Chase RTB2 offer notice from Manchester City Council', type: 'chase', urgency: 'high', completed: false },
      { step: 'Await Nationwide mortgage offer — survey booked',      type: 'check', urgency: 'high', completed: false },
      { step: 'Send document checklist to clients',                   type: 'email', urgency: 'low',  completed: true  },
    ],
    notes: [],
  },
  {
    reference_id:  'HM-2026-008',
    client_name:   'Sofia Esposito',
    client_email:  's.esposito@example.com',
    client_phone:  '+39 347 9876543',
    nationality:   'Italian',
    visa_type:     'Spouse Visa',
    case_type:     'spouse_visa',
    status:        'completed',
    description:   'Spouse visa application to join British citizen husband Marcus Esposito in Manchester.',
    assigned_email:'william.moore@hartleymoore.co.uk',
    ai_summary:    'Spouse visa granted 22 February 2026. Sofia Esposito, 31, Italian national joined her British husband Marcus Esposito in Manchester. Visa valid until 22 August 2028 (30 months). Leave to remain on family route. File closed. Advised client to apply for further leave or ILR before expiry. Next review date: August 2028.',
    actions: [
      { step: 'Submit spouse visa application online',                        type: 'submission', urgency: 'high',   completed: true },
      { step: 'Book biometric appointment at UKVCAS',                         type: 'check',      urgency: 'high',   completed: true },
      { step: 'Notify client of visa grant — send copy BRP collection letter',type: 'email',      urgency: 'medium', completed: true },
    ],
    notes: [],
  },
  {
    reference_id:  'HM-2026-009',
    client_name:   'George & Margaret Hargreaves',
    client_email:  'hargreaves.family@example.com',
    client_phone:  '+44 7700 900005',
    nationality:   'British',
    visa_type:     'Remortgage',
    case_type:     'remortgage',
    status:        'in_progress',
    description:   'Residential remortgage from Lloyds Bank to HSBC at 12 Chestnut Grove, Chorlton, M21 9WQ.',
    assigned_email:'priya.patel@hartleymoore.co.uk',
    ai_summary:    "Remortgage of 12 Chestnut Grove, Chorlton, M21 9WQ. Current lender: Lloyds Bank. New lender: HSBC (£245,000, 5-year fixed at 4.12%). Property value: £410,000. Title clear — freehold. No restrictions or charges beyond existing mortgage. Lloyds redemption statement: £241,750. HSBC mortgage offer received 15 May 2026. Awaiting lender's solicitors' requirements pack. Target completion: 20 June 2026.",
    actions: [
      { step: 'Obtain HSBC lender requirements pack',             type: 'document', urgency: 'high',   completed: false },
      { step: 'Confirm redemption figure with Lloyds Bank',       type: 'document', urgency: 'medium', completed: true  },
      { step: 'Review title register for any additional charges', type: 'check',    urgency: 'medium', completed: true  },
      { step: 'Send completion statement to clients',             type: 'email',    urgency: 'medium', completed: false },
    ],
    notes: [
      { content: 'HSBC mortgage offer received 15 May. Excellent terms — 4.12% fixed for 5 years. Clients very pleased.',                        author: 'priya.patel@hartleymoore.co.uk'  },
      { content: 'Title register checked — freehold, no restrictions. Clean title. Ready to proceed once lender pack received.',                   author: 'marco.ferretti@hartleymoore.co.uk' },
    ],
  },
  {
    reference_id:  'HM-2026-010',
    client_name:   'Carlos Mendoza',
    client_email:  'c.mendoza@example.com',
    client_phone:  '+34 655 678901',
    nationality:   'Spanish',
    visa_type:     'Skilled Worker Visa',
    case_type:     'skilled_worker_visa',
    status:        'new',
    description:   'Skilled Worker visa renewal for Head Chef at La Piazza Restaurant, Leeds Road, Manchester.',
    assigned_email:'marco.ferretti@hartleymoore.co.uk',
    ai_summary:    'Carlos Mendoza, 38, Spanish national. Skilled Worker visa renewal for position of Head Chef at La Piazza Restaurant, Leeds Road, Manchester. Sponsor licence confirmed active (A-rated). New CoS issued 28 April 2026. Salary £34,500 pa — above threshold for SOC code 5434. Current visa expires 31 July 2026 — urgent timeline. No criminal record. Previous visa granted without issue. Documents largely in order; awaiting updated bank statements and employer HR letter.',
    actions: [
      { step: 'Request bank statements (last 3 months)',                type: 'document', urgency: 'high', completed: false },
      { step: 'Obtain employer HR letter confirming salary and position',type: 'document', urgency: 'high', completed: false },
      { step: 'Send document checklist urgently — visa expires 31 July',type: 'email',    urgency: 'high', completed: false },
      { step: 'Run eligibility check',                                  type: 'check',    urgency: 'high', completed: false },
    ],
    notes: [
      { content: 'Carlos called 30 May — urgent situation. Current visa expires 31 July. Must submit by mid-July at latest. Instructed to gather documents immediately.', author: 'marco.ferretti@hartleymoore.co.uk' },
      { content: 'Sponsor licence verified on UKVI register — La Piazza Restaurant, A-rated, active. CoS reference checked and valid.',                                  author: 'william.moore@hartleymoore.co.uk'  },
    ],
  },
]

const LEADS_DEF = [
  { name: "Patrick O'Sullivan", email: 'patrick.osullivan@gmail.com',  firm_type: 'immigration',  status: 'new',       message: "Enquired about ILR application. Has been on Skilled Worker visa for 4 years. Wants to know eligibility timeline." },
  { name: 'Valentina Costa',    email: 'valentina.costa@hotmail.com',  firm_type: 'conveyancing', status: 'contacted', message: 'First-time buyer, budget £280,000, looking in Salford area. Pre-approved mortgage with Santander. Called back 25 May — sending quote.' },
  { name: 'Henry Blackwood',    email: 'h.blackwood@outlook.com',      firm_type: 'conveyancing', status: 'qualified', message: 'Selling 4-bed in Didsbury, asking price £595,000. Already has buyer. Wants to instruct immediately. High priority lead.' },
  { name: 'Amara Osei',         email: 'amara.osei@gmail.com',         firm_type: 'immigration',  status: 'new',       message: 'Enquired about Skilled Worker visa for nurse position at Manchester Royal Infirmary. Sponsor licence confirmed. Needs urgent advice.' },
  { name: 'Francesca Bellini',  email: 'francesca.bellini@gmail.com',  firm_type: 'immigration',  status: 'contacted', message: 'Spouse visa enquiry. Married to British citizen. Currently in Italy. Income threshold question raised — referred to William.' },
  { name: 'Daniel Ashworth',    email: 'd.ashworth@yahoo.co.uk',       firm_type: 'conveyancing', status: 'new',       message: 'Remortgage enquiry. Current deal ending August 2026. Property value approx £320,000, outstanding mortgage £195,000.' },
]

// ─── cleanup (idempotent) ─────────────────────────────────────────────────────

async function cleanup() {
  console.log('\n════════════════════════════════════════════════')
  console.log('  Checking for existing Hartley & Moore data…')
  console.log('════════════════════════════════════════════════')

  const existing = await query('firms', 'slug=eq.hartley-moore&select=id,name')
  if (!existing.length) {
    ok('No existing firm found — clean slate')
    return
  }

  const firmId = existing[0].id
  info(`Found existing firm ${firmId} — deleting all related data…`)

  // Delete in FK-safe order
  const notesN  = await del('notes',               `firm_id=eq.${firmId}`)
  const casesN  = await del('cases',               `firm_id=eq.${firmId}`)   // cascades case_actions
  const leadsN  = await del('leads',               `firm_id=eq.${firmId}`)
  const tmN     = await del('team_members',        `firm_id=eq.${firmId}`)
  const usersN  = await del('users',               `firm_id=eq.${firmId}`)
  const fsN     = await del('firm_settings',       `firm_id=eq.${firmId}`)
  const esN     = await del('email_settings',      `firm_id=eq.${firmId}`)
  const ctN     = await del('checklist_templates', `firm_id=eq.${firmId}`)
  const qtN     = await del('quote_templates',     `firm_id=eq.${firmId}`)
  const payN    = await del('payments',            `firm_id=eq.${firmId}`)
  const fnN     = await del('firm_notes',          `firm_id=eq.${firmId}`)
  await del('firms', `id=eq.${firmId}`)

  ok(`Cleanup complete — deleted: ${casesN} cases, ${leadsN} leads, ${notesN} notes, ${tmN} team_members, ${usersN} users, ${ctN} checklists, ${qtN} quotes, ${payN} payments, ${fnN} firm_notes, ${fsN} firm_settings, ${esN} email_settings`)
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║   Hartley & Moore Solicitors — Demo Seed Script  ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log(`  Supabase: ${SUPABASE_URL}`)

  await cleanup()

  // ─── STEP 1: FIRM ──────────────────────────────────────────────────────────
  step(1, 'Creating firm')
  const [firm] = await insert('firms', {
    name:                 'Hartley & Moore Solicitors',
    slug:                 'hartley-moore',
    plan:                 'full_setup',
    active:               true,
    primary_color:        '#1e3a5f',
    onboarding_completed: true,
    onboarding_steps:     { welcome: true, intake: true, team: true, settings: true, first_case: true },
    notification_prefs:   { daily_digest: true, weekly_summary: true, new_lead: true, case_update: true },
  })
  const firmId = firm.id
  ok(`id: ${firmId}`)
  ok(`slug: ${firm.slug}`)

  // ─── STEP 2: FIRM SETTINGS ─────────────────────────────────────────────────
  step(2, 'Creating firm settings')
  await insert('firm_settings', {
    firm_id:   firmId,
    firm_name: 'Hartley & Moore Solicitors',
    address:   '42 King Street, Manchester, M2 4LQ',
    phone:     '+44 161 834 7200',
    website:   'https://hartleymoore.co.uk',
  })
  ok('firm_settings inserted')

  // ─── STEP 3: EMAIL SETTINGS ────────────────────────────────────────────────
  step(3, 'Creating email settings')
  await insert('email_settings', {
    firm_id:        firmId,
    from_name:      'Hartley & Moore Solicitors',
    from_email:     'info@hartleymoore.co.uk',
    reply_to:       'info@hartleymoore.co.uk',
    signature_html: 'Kind regards,\nHartley & Moore Solicitors\n42 King Street, Manchester, M2 4LQ\nTel: +44 161 834 7200\nwww.hartleymoore.co.uk',
  })
  ok('email_settings inserted')

  // ─── STEP 4: TEAM MEMBERS (for case assignment) ────────────────────────────
  step(4, 'Creating team members')
  const tmRows = [
    { firm_id: firmId, name: 'Charlotte Hartley', email: 'charlotte.hartley@hartleymoore.co.uk', role: 'managing_partner',    active: true },
    { firm_id: firmId, name: 'William Moore',     email: 'william.moore@hartleymoore.co.uk',     role: 'senior_solicitor',    active: true },
    { firm_id: firmId, name: 'Priya Patel',       email: 'priya.patel@hartleymoore.co.uk',       role: 'senior_solicitor',    active: true },
    { firm_id: firmId, name: 'Marco Ferretti',    email: 'marco.ferretti@hartleymoore.co.uk',    role: 'associate_solicitor', active: true },
    { firm_id: firmId, name: 'Isabella Ruiz',     email: 'isabella.ruiz@hartleymoore.co.uk',     role: 'paralegal',           active: true },
    { firm_id: firmId, name: 'Oliver Bennett',    email: 'oliver.bennett@hartleymoore.co.uk',    role: 'receptionist',        active: true },
  ]
  const teamMembers = await insert('team_members', tmRows)
  // email → uuid map for case assignment
  const teamMap = {}
  for (const tm of teamMembers) {
    teamMap[tm.email] = tm.id
    ok(`${tm.name} (${tm.role}) → ${tm.id}`)
  }

  // ─── STEP 5: USERS (auth) ──────────────────────────────────────────────────
  step(5, 'Hashing password + creating users')
  info('bcrypt saltRounds=10, password="Demo2026!" …')
  const hash = await bcrypt.hash('Demo2026!', 10)
  ok(`hash: ${hash.slice(0, 30)}…`)

  const userRows = [
    { firm_id: firmId, name: 'Charlotte Hartley', email: 'charlotte.hartley@hartleymoore.co.uk', password_hash: hash, role: 'managing_partner' },
    { firm_id: firmId, name: 'William Moore',     email: 'william.moore@hartleymoore.co.uk',     password_hash: hash, role: 'senior_solicitor' },
    { firm_id: firmId, name: 'Priya Patel',       email: 'priya.patel@hartleymoore.co.uk',       password_hash: hash, role: 'senior_solicitor' },
    { firm_id: firmId, name: 'Marco Ferretti',    email: 'marco.ferretti@hartleymoore.co.uk',    password_hash: hash, role: 'associate_solicitor' },
    { firm_id: firmId, name: 'Isabella Ruiz',     email: 'isabella.ruiz@hartleymoore.co.uk',     password_hash: hash, role: 'paralegal' },
    { firm_id: firmId, name: 'Oliver Bennett',    email: 'oliver.bennett@hartleymoore.co.uk',    password_hash: hash, role: 'receptionist' },
  ]
  const users = await insert('users', userRows)
  ok(`${users.length} users created`)
  for (const u of users) info(`${u.email}`)

  // ─── STEP 6: CHECKLIST TEMPLATES ───────────────────────────────────────────
  step(6, 'Creating checklist templates')
  const checklistRows = [
    {
      firm_id:   firmId,
      case_type: 'skilled_worker_visa',
      title:     'Skilled Worker Visa Document Checklist',
      items:     [
        'Valid passport (minimum 6 months validity)',
        'Certificate of Sponsorship (CoS) from employer',
        'Proof of English language proficiency (IELTS/degree certificate)',
        'Bank statements (last 3 months, minimum £1,270 balance)',
        'Tuberculosis test results (if applicable)',
        'Salary evidence / employment contract',
        'Biometric Residence Permit (if extending)',
      ],
      gov_url: 'https://www.gov.uk/skilled-worker-visa',
    },
    {
      firm_id:   firmId,
      case_type: 'indefinite_leave_to_remain',
      title:     'ILR Application Document Checklist',
      items:     [
        'Current valid passport and all previous passports',
        'Biometric Residence Permit',
        'Evidence of continuous lawful residence (5 years)',
        'Absence records (travel history)',
        'English language test certificate (B1 or above)',
        'Life in the UK test pass letter',
        'Employer letter confirming employment',
        'P60 or tax records for last 5 years',
      ],
      gov_url: 'https://www.gov.uk/indefinite-leave-to-remain',
    },
    {
      firm_id:   firmId,
      case_type: 'spouse_visa',
      title:     'Spouse/Partner Visa Document Checklist',
      items:     [
        'Valid passport for both applicant and sponsor',
        'Marriage or civil partnership certificate',
        "Sponsor's proof of settlement/British citizenship",
        'Financial evidence (£29,000 gross annual income from 11 April 2024)',
        'Accommodation evidence (tenancy agreement or mortgage statement)',
        'English language test certificate (A2 or above)',
        'Photos (passport-sized, white background)',
        'Relationship evidence (photos, correspondence, joint accounts)',
      ],
      gov_url: 'https://www.gov.uk/uk-family-visa',
    },
    {
      firm_id:   firmId,
      case_type: 'residential_purchase',
      title:     'Residential Purchase Conveyancing Checklist',
      items:     [
        'Signed instruction letter and ID verification',
        'Mortgage offer letter',
        'Survey report',
        'Search results (local authority, water, environmental)',
        "Draft contract and title documents from seller's solicitor",
        'Fixtures and fittings form (TA10)',
        'Property information form (TA6)',
        'Buildings insurance details',
        'Signed transfer deed (TR1)',
        'Stamp Duty Land Tax return (SDLT1)',
      ],
      gov_url: 'https://www.gov.uk/buy-sell-your-home',
    },
    {
      firm_id:   firmId,
      case_type: 'residential_sale',
      title:     'Residential Sale Conveyancing Checklist',
      items:     [
        'Title deeds or Land Registry title number',
        'Signed instruction letter and ID verification',
        'Property information form (TA6)',
        'Fixtures and fittings form (TA10)',
        'Energy Performance Certificate (EPC)',
        'Building regulations certificates (extensions, conversions)',
        'Warranties and guarantees (NHBC, windows, boiler)',
        'Leasehold documents (if applicable)',
        'Mortgage redemption statement',
        'Signed transfer deed (TR1)',
      ],
      gov_url: 'https://www.gov.uk/buy-sell-your-home',
    },
  ]
  const checklists = await insert('checklist_templates', checklistRows)
  ok(`${checklists.length} checklist templates created`)
  for (const c of checklists) info(`${c.case_type}`)

  // ─── STEP 7: QUOTE TEMPLATES ───────────────────────────────────────────────
  // Schema: min_fee, max_fee, currency, vat_included, notes (no line-items column).
  // We set min_fee = max_fee = total sum of items and embed line detail in notes.
  step(7, 'Creating quote templates')
  const quoteRows = [
    {
      firm_id:      firmId,
      case_type:    'skilled_worker_visa',
      min_fee:      1850,   // 1200+300+150+200
      max_fee:      1850,
      currency:     'GBP',
      vat_included: false,
      notes:        'Legal advice and application preparation £1,200 | Document review and verification £300 | UKVI application submission £150 | Post-decision support £200 | Total: £1,850 + VAT. Home Office application fee (£719) and Immigration Health Surcharge payable separately by client.',
    },
    {
      firm_id:      firmId,
      case_type:    'indefinite_leave_to_remain',
      min_fee:      2450,   // 500+1500+300+150
      max_fee:      2450,
      currency:     'GBP',
      vat_included: false,
      notes:        'Eligibility assessment and advice £500 | Application preparation and document review £1,500 | UKVI submission and correspondence £300 | Biometric appointment support £150 | Total: £2,450 + VAT. Home Office fee (£2,885) payable separately.',
    },
    {
      firm_id:      firmId,
      case_type:    'residential_purchase',
      min_fee:      2200,   // 1495+350+270+35+50
      max_fee:      2200,
      currency:     'GBP',
      vat_included: false,
      notes:        'Legal fees up to £500,000 purchase price £1,495 | Search pack (local authority, water, environmental) £350 | Land Registry registration fee £270 | Electronic money transfer fee £35 | ID verification and AML checks £50 | Total: £2,200. VAT at 20% on legal fees only. SDLT calculated separately.',
    },
    {
      firm_id:      firmId,
      case_type:    'residential_sale',
      min_fee:      1292,   // 1195+12+35+50
      max_fee:      1292,
      currency:     'GBP',
      vat_included: false,
      notes:        'Legal fees up to £500,000 sale price £1,195 | Land Registry official copies £12 | Electronic money transfer fee £35 | ID verification and AML checks £50 | Total: £1,292. VAT at 20% on legal fees only.',
    },
  ]
  const quotes = await insert('quote_templates', quoteRows)
  ok(`${quotes.length} quote templates created`)
  for (const q of quotes) info(`${q.case_type} → £${q.min_fee}`)

  // ─── STEP 8: EMAIL TEMPLATES ───────────────────────────────────────────────
  // Note: email_templates has no firm_id column (global table). We upsert to
  // update the global defaults with Hartley & Moore's custom text.
  step(8, 'Upserting email templates (global table — no firm_id)')
  const emailTemplateRows = [
    {
      template_type: 'checklist',
      subject:       'Your Document Checklist — {{case_type}} | Hartley & Moore',
      body_html:     'Dear {{client_name}},\n\nThank you for instructing Hartley & Moore Solicitors. Please find below your personalised document checklist for your {{case_type}} matter.\n\n{{checklist_items}}\n\nPlease ensure all documents are provided in good time to avoid delays. Certified copies are required for original documents.\n\nIf you have any questions, please do not hesitate to contact us.\n\n{{signature}}',
    },
    {
      template_type: 'quote',
      subject:       'Fee Estimate — {{case_type}} | Hartley & Moore',
      body_html:     'Dear {{client_name}},\n\nPlease find below our fee estimate for your {{case_type}} matter.\n\n{{quote_items}}\n\nAll fees are subject to VAT at 20% unless otherwise stated. This estimate is valid for 30 days.\n\nTo proceed, please reply to this email or call us on +44 161 834 7200.\n\n{{signature}}',
    },
    {
      template_type: 'followup',
      subject:       'Following Up — {{case_reference}} | Hartley & Moore',
      body_html:     'Dear {{client_name}},\n\nI hope this message finds you well. I am writing to follow up on your {{case_type}} matter (ref: {{case_reference}}).\n\n{{followup_message}}\n\nPlease feel free to contact us if you have any questions or if there is anything we can do to assist.\n\n{{signature}}',
    },
  ]
  // Use upsert (merge-duplicates) on the unique template_type column
  const etRes = await fetch(`${SUPABASE_URL}/rest/v1/email_templates`, {
    method:  'POST',
    headers: headers({ Prefer: 'resolution=merge-duplicates,return=representation' }),
    body:    JSON.stringify(emailTemplateRows),
  })
  const etText = await etRes.text()
  if (!etRes.ok) {
    console.warn(`  ⚠  email_templates upsert → ${etRes.status}: ${etText}`)
    info('Continuing — default global email templates will be used')
  } else {
    const etData = JSON.parse(etText)
    ok(`${etData.length} email templates upserted (global)`)
  }

  // ─── STEP 9: CASES ─────────────────────────────────────────────────────────
  step(9, 'Creating 10 cases')
  const caseRows = CASES_DEF.map(c => ({
    firm_id:      firmId,
    reference_id: c.reference_id,
    client_name:  c.client_name,
    client_email: c.client_email,
    client_phone: c.client_phone,
    nationality:  c.nationality,
    visa_type:    c.visa_type,
    case_type:    c.case_type,
    status:       c.status,
    description:  c.description,
    ai_summary:   c.ai_summary,
    assigned_to:  teamMap[c.assigned_email] || null,
  }))

  const cases = await insert('cases', caseRows)
  // Build reference → id map
  const caseMap = {}
  for (const c of cases) caseMap[c.reference_id] = c.id
  ok(`${cases.length} cases created`)
  for (const c of cases) info(`${c.reference_id}  ${c.client_name}  [${c.status}]  → ${c.id}`)

  // ─── STEP 10: CASE ACTIONS ─────────────────────────────────────────────────
  step(10, 'Creating case actions')
  const actionRows = []
  for (const caseDef of CASES_DEF) {
    const caseId = caseMap[caseDef.reference_id]
    if (!caseId) continue
    caseDef.actions.forEach((a, i) => {
      actionRows.push({
        case_id:      caseId,
        step:         a.step,
        type:         a.type,
        urgency:      a.urgency,
        completed:    a.completed,
        sort_order:   i,
        completed_at: a.completed ? new Date().toISOString() : null,
      })
    })
  }
  const actions = await insert('case_actions', actionRows)
  ok(`${actions.length} case actions created`)
  for (const caseDef of CASES_DEF) {
    const count = caseDef.actions.length
    info(`${caseDef.reference_id}: ${count} actions (${caseDef.actions.filter(a=>a.completed).length} completed)`)
  }

  // ─── STEP 11: NOTES ────────────────────────────────────────────────────────
  step(11, 'Creating case notes')
  const noteRows = []
  for (const caseDef of CASES_DEF) {
    const caseId = caseMap[caseDef.reference_id]
    if (!caseId || !caseDef.notes.length) continue
    for (const n of caseDef.notes) {
      noteRows.push({
        firm_id:     firmId,
        entity_type: 'case',
        entity_id:   caseId,
        content:     n.content,
        author:      n.author,
      })
    }
  }
  if (noteRows.length) {
    const notes = await insert('notes', noteRows)
    ok(`${notes.length} notes created`)
    for (const caseDef of CASES_DEF) {
      if (caseDef.notes.length) info(`${caseDef.reference_id}: ${caseDef.notes.length} notes`)
    }
  } else {
    info('No notes to insert')
  }

  // ─── STEP 12: LEADS ────────────────────────────────────────────────────────
  step(12, 'Creating 6 leads')
  const leadRows = LEADS_DEF.map(l => ({
    firm_id:   firmId,
    name:      l.name,
    firm_name: 'Hartley & Moore Solicitors',
    email:     l.email,
    firm_type: l.firm_type,
    status:    l.status,
    message:   l.message,
    source:    'direct_enquiry',
  }))
  const leads = await insert('leads', leadRows)
  ok(`${leads.length} leads created`)
  for (const l of leads) info(`${l.name} [${l.status}]`)

  // ─── STEP 13: PAYMENTS ─────────────────────────────────────────────────────
  step(13, 'Creating 5 payments')
  const paymentRows = [
    { firm_id: firmId, amount: 2500, currency: 'GBP', payment_type: 'full_setup', status: 'paid', description: 'Full Setup package',  paid_at: '2026-01-15T10:00:00Z', created_at: '2026-01-15T10:00:00Z' },
    { firm_id: firmId, amount: 1500, currency: 'GBP', payment_type: 'retainer',   status: 'paid', description: 'Monthly retainer',    paid_at: '2026-02-01T10:00:00Z', created_at: '2026-02-01T10:00:00Z' },
    { firm_id: firmId, amount: 1500, currency: 'GBP', payment_type: 'retainer',   status: 'paid', description: 'Monthly retainer',    paid_at: '2026-03-01T10:00:00Z', created_at: '2026-03-01T10:00:00Z' },
    { firm_id: firmId, amount: 1500, currency: 'GBP', payment_type: 'retainer',   status: 'paid', description: 'Monthly retainer',    paid_at: '2026-04-01T10:00:00Z', created_at: '2026-04-01T10:00:00Z' },
    { firm_id: firmId, amount: 1500, currency: 'GBP', payment_type: 'retainer',   status: 'paid', description: 'Monthly retainer',    paid_at: '2026-05-01T10:00:00Z', created_at: '2026-05-01T10:00:00Z' },
  ]
  const payments = await insert('payments', paymentRows)
  ok(`${payments.length} payments recorded  (total: £${paymentRows.reduce((s,p)=>s+p.amount,0).toLocaleString()})`)

  // ─── STEP 14: FIRM NOTES (admin-only) ──────────────────────────────────────
  step(14, 'Creating firm notes (platform admin)')
  const firmNoteRows = [
    { firm_id: firmId, content: 'Onboarding completed smoothly. Charlotte Hartley very engaged — asked about Stripe integration for client payments. Follow up in Q3 2026.', author: 'Baturay' },
    { firm_id: firmId, content: 'May retainer paid on time. Firm actively using daily digest. 3 AI eligibility checks run this month.',                                        author: 'Baturay' },
  ]
  const firmNotes = await insert('firm_notes', firmNoteRows)
  ok(`${firmNotes.length} firm notes created`)

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║                 SEED COMPLETE  ✓                 ║')
  console.log('╠══════════════════════════════════════════════════╣')
  console.log(`║  Firm ID        ${firmId}  ║`)
  console.log('╠══════════════════════════════════════════════════╣')
  console.log(`║  6  users       (password: Demo2026!)            ║`)
  console.log(`║  6  team_members                                 ║`)
  console.log(`║  5  checklist templates                          ║`)
  console.log(`║  4  quote templates                              ║`)
  console.log(`║  3  email templates  (global upsert)             ║`)
  console.log(`║  ${cases.length} cases                                       ║`)
  console.log(`║  ${actions.length} case actions                                ║`)
  console.log(`║  ${noteRows.length} case notes                                 ║`)
  console.log(`║  ${leads.length}  leads                                       ║`)
  console.log(`║  ${payments.length}  payments (£${paymentRows.reduce((s,p)=>s+p.amount,0).toLocaleString()} total)                   ║`)
  console.log(`║  2  firm notes                                   ║`)
  console.log('╠══════════════════════════════════════════════════╣')
  console.log('║  Login: charlotte.hartley@hartleymoore.co.uk     ║')
  console.log('║  Pass:  Demo2026!                                ║')
  console.log('╚══════════════════════════════════════════════════╝\n')
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message)
  if (err.stack) console.error(err.stack)
  process.exit(1)
})
