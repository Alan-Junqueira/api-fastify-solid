import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
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

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should be able to check in twice at the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId,
      userId
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId
      })
    ).rejects.toBeInstanceOf(Error)
  })

  it('should be able to check in twice, but at different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId,
      userId
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId,
      userId
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})