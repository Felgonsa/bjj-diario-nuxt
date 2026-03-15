import { NuxtAuthHandler } from '#auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { db } from '~/db/index'; // Ajuste se o caminho do seu db for diferente

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  // @ts-expect-error - Forçando o adaptador para evitar conflito de tipagem
  adapter: DrizzleAdapter(db),
  providers: [
    // O .default é ESTRITAMENTE OBRIGATÓRIO no Nuxt 3 para o provedor do Google
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    })
  ],
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        (session.user as any).id = user.id;
      }
      return session;
    }
  }


})