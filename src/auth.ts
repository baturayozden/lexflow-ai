import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getUserByEmail, verifyPassword, updateLastLogin } from './lib/auth-db'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await getUserByEmail(credentials.email as string)
        if (!user) return null

        const valid = await verifyPassword(
          credentials.password as string,
          user.password_hash
        )
        if (!valid) return null

        await updateLastLogin(user.id)

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          firmId: user.firm_id,
          firmName: (user.firms as Record<string, unknown>)?.name as string || null,
          firmPlan: (user.firms as Record<string, unknown>)?.plan as string || null,
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as Record<string, unknown>).role
        token.firmId = (user as Record<string, unknown>).firmId
        token.firmName = (user as Record<string, unknown>).firmName
        token.firmPlan = (user as Record<string, unknown>).firmPlan
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = session.user as any
        u.role = token.role
        u.firmId = token.firmId
        u.firmName = token.firmName
        u.firmPlan = token.firmPlan
        u.id = token.sub
      }
      return session
    },
  },
})
