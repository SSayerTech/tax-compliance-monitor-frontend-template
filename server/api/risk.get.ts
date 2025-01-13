export default defineEventHandler(async (event) => {
  // This can be used for server-side processing if needed
  // For now, we'll proxy to our NestJS backend
  const config = useRuntimeConfig()
  
  try {
    const response = await fetch(`${config.public.apiBase}/api/risk`)
    if (!response.ok) throw new Error('Backend service error')
    return await response.json()
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch risk data'
    })
  }
})