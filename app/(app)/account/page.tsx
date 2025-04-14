import { getUserProfile } from '@/lib/actions/users'
import { authorizeUser } from '@/lib/supabase/authorize-user'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'

export default async function AccountPage() {
  const { user } = await authorizeUser()
  if (!user) {
    redirect('/login')
  }
  const profile = await getUserProfile(user.id)

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      <AccountForm initialData={profile} />
    </div>
  )
}
