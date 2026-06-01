import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { isPlatformAdmin } from '@/lib/permissions'
import ContentQueueClient from './ContentQueueClient'

export default async function ContentPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  if (!isPlatformAdmin((session.user as Record<string, unknown>).role as string)) redirect('/admin')

  return <ContentQueueClient />
}
