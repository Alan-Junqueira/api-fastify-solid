import { expect, describe, it, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase
const name = 'Jhon Doe'
const password = '12345678'
const email = 'jhondoe@example.com'

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    // ? System under test
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name,
      email,
      password_hash: await hash(password, 6)
    })

    const { user } = await sut.execute({
      userId: createdUser.id
    })

    expect(user.name).toEqual(name)
  })

  it('should not be able to get user profile with wrong id', async () => {

    await expect(() =>
      sut.execute({
        userId: 'non-created-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})