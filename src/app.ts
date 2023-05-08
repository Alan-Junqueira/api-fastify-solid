import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'

export const app = fastify()

app.register(appRoutes)

app.setErrorHandler((err, _req, rep) => {
  if (err instanceof ZodError) {
    return rep.status(400).send({ message: 'Validation Error.', issues: err.format() })
  }

  if(env.NODE_ENV !== 'production'){
    console.error(err)
  } else {
    // Todo: here we should log to an external tool like: Datadog/NewRelic/Sentry 
  }

  return rep.status(500).send({ message: 'Internal Server Error.' })
})