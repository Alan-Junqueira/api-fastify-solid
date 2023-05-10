import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  const gymId = 'gym-01'
  const userId = 'user-01'

  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    // ? System under test
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})