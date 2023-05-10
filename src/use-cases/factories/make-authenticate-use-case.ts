import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { AuthenticateUseCase } from "../authenticate"

export function makeAuthenticateUseCase() {
  const prismaUseRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUseRepository)

  return authenticateUseCase
}