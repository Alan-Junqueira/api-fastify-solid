import { UsersRepository } from '@/repositories/prisma/users-repository'
import { hash } from 'bcryptjs'

interface IRegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {
  }

  async execute({ email, name, password }: IRegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)

    const userWithEmail = await this.usersRepository.findByEmail(email)

    if (userWithEmail) {
      throw new Error('E-mail already exists')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
