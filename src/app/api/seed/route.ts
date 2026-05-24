import { NextRequest, NextResponse } from 'next/server'
import { seedSuperAdmin } from '@/lib/auth-db'

export async function POST(req: NextRequest) {
  // Auth temporarily disabled for seeding
  console.log('CRON_SECRET value:', process.env.CRON_SECRET)

  try {
    const admin = await seedSuperAdmin()
    return NextResponse.json({
      success: true,
      admin: { id: admin.id, email: admin.email, role: admin.role },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
