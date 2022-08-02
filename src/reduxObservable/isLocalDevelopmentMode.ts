const isLocalDevelopmentMode = (
  (
    process
    .env
    .NODE_ENV
  )
  === 'development'
)

if (isLocalDevelopmentMode) {
  console
  .info(
    '[COLORMATE] LOCAL DEVELOPMENT MODE'
  )
}

export default isLocalDevelopmentMode
