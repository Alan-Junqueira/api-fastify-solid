import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const password = '12345678'
    const registerUseCase = new RegisterUseCase({
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          created_at: new Date(),
          email: data.email,
          password_hash: data.password_hash
        }
      },
      async findByEmail(email) {
        return null
      },
    })

    const { user } = await registerUseCase.execute({
      name: 'Jhon Doe',
      email: 'jhondoe@example.com',
      password
    })

    const isPasswordCorrectlyHashed = await compare(password, user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})