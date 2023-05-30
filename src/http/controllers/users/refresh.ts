import { FastifyReply, FastifyRequest } from 'fastify'

export async function refresh(req: FastifyRequest, rep: FastifyReply) {
  await req.jwtVerify({ onlyCookie: true })

  const { role } = req.user

  const token = await rep.jwtSign(
    {
      role
    },
    {
      sign: {
        sub: req.user.sub
      }
    })

  const refreshToken = await rep.jwtSign(
    {
      role
    },
    {
      sign: {
        sub: req.user.sub,
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

}
