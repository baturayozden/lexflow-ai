import { NextResponse } from 'next/server'
import { seedSuperAdmin } from '@/lib/auth-db'

export async function POST() {
  try {
    const admin = await seedSuperAdmin()
    return NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, role: admin.role } })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
