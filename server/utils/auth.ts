import { getServerSession } from '#auth'
import { H3Event } from 'h3'

export const requireUser = async (event: H3Event) => {
  const session = await getServerSession(event)

  if (!session || !session.user) {
    throw createError({ 
      statusCode: 401, 
      statusMessage: 'Acesso negado. O tatame está fechado para visitantes.' 
    })
  }

  // Se passou, extrai e devolve apenas o ID limpo para você usar
  return (session.user as any).id as string
}