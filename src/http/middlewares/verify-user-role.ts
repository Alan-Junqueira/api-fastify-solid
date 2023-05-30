import { FastifyReply, FastifyRequest } from "fastify";

export function verifyUserRole(roleToVerify: 'admin' | 'member') {
  return async (
    req: FastifyRequest,
    rep: FastifyReply,
  ) => {
    const { role } = req.user

    if (role !== roleToVerify) {
      return rep.status(401).send({ message: 'Unauthorized' })
    }
  }
}