import { FastifyReply, FastifyRequest } from 'fastify'

export async function profile(req: FastifyRequest, rep: FastifyReply) {
  console.log(req.headers)
  await req.jwtVerify()

  console.log(req.user.sub)

  return rep.send().status(200)
}
