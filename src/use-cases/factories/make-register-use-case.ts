import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository"
import { RegisterUseCase } from "../register"

export function makeRegisterUseCase() {
  const prismaUseRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(prismaUseRepository)

  return registerUseCase
}