import { NextRequest, NextResponse } from 'next/server'
import { seedSuperAdmin } from '@/lib/auth-db'

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
