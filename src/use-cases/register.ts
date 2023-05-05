import { prisma } from '@/lib/prisma'
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

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
    },
  })
}
