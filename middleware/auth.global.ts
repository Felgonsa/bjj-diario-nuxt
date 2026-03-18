export default defineNuxtRouteMiddleware((to, from) => {
  const { status } = useAuth()

  // Se a página for de login, deixa passar
  if (to.path === '/login') {
    return
  }

  // Se o status for deslogado e ele tentar ir pra qualquer outro lugar, chuta pro login
  if (status.value === 'unauthenticated') {
    return navigateTo('/login')
  }
})