import { app } from './app'
import { env } from './env'
import kill from 'kill-port'

const killTerminal = async () => {
  await kill(env.PORT)
}

killTerminal()

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then(() => {
    console.log('🚀 Http server running on port 3333')
  })
