import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function authenticate(req: FastifyRequest, rep: FastifyReply) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(req.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await rep.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    const refreshToken = await rep.jwtSign({}, {
      sign: {
        sub: user.id,
        expiresIn: '7d'
      }
    })

    return rep
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true, // ? HTTPS
        sameSite: true, // ? Não pode ser acessado em outro domínio
        httpOnly: true, // ? Só pode ser acessado no backend
      })
      .status(200)
      .send({ token })

  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return rep.status(400).send({ message: err.message })
    }

    throw err
  }
}
