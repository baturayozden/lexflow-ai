export const PLATFORM_ROLES = ['platform_admin'] as const
export const FIRM_ROLES = [
  'managing_partner',
  'senior_solicitor',
  'associate_solicitor',
  'paralegal',
  'receptionist',
] as const

export type PlatformRole = (typeof PLATFORM_ROLES)[number]
export type FirmRole = (typeof FIRM_ROLES)[number]
export type UserRole = PlatformRole | FirmRole

export function isPlatformAdmin(role: string): boolean {
  return role === 'platform_admin'
}

export function isFirmAdmin(role: string): boolean {
  return role === 'managing_partner'
}

export function canManageFirm(role: string): boolean {
  return isPlatformAdmin(role) || isFirmAdmin(role)
}

export function canViewAllFirms(role: string): boolean {
  return isPlatformAdmin(role)
}

export const ROLE_LABELS: Record<string, string> = {
  platform_admin: 'Platform Admin',
  managing_partner: 'Managing Partner',
  senior_solicitor: 'Senior Solicitor',
  associate_solicitor: 'Associate Solicitor',
  paralegal: 'Paralegal',
  receptionist: 'Receptionist',
}
