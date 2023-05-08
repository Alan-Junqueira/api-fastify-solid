import { UsersRepository } from '@/repositories/prisma/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface IRegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface IRegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {
  }

  async execute({ email, name, password }: IRegisterUseCaseRequest): Promise<IRegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userWithEmail = await this.usersRepository.findByEmail(email)

    if (userWithEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
