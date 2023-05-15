import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  const gymId = 'gym-01'
  const userId = 'user-01'

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    // ? System under test
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // await gymsRepository.create({
    //   id: gymId,
    //   title: gymTitle,
    //   description: gymDescription,
    //   phone: gymPhone,
    //   latitude: gymLatitude,
    //   longitude: gymLongitude
    // })

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: gymId,
      user_id: userId
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id'
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})