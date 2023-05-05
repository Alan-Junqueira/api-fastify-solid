import { prisma } from '@/lib/prisma'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface IRegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  email,
  name,
  password,
}: IRegisterUseCaseRequest) {
  const password_hash = await hash(password, 6)

  const userWithEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (userWithEmail) {
    throw new Error('E-mail already exists')
  }

  const prsimaUsersRepository = new PrismaUsersRepository()

  await prsimaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
