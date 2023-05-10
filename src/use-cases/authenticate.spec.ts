import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('authenticate Use Case', () => {
  const name = 'Jhon Doe'
  const password = '12345678'
  const email = 'jhondoe@example.com'

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    // ? System under test
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { user } = await sut.execute({
      email,
      password
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => sut.execute({
      email,
      password
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    await expect(() => sut.execute({
      email,
      password: password + "1"
    })).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})