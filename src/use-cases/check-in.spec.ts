import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check In Use Case', () => {
  const gymId = 'gym-01'
  const gymTitle = "Javascript Gym"
  const gymDescription = ""
  const gymPhone = ''
  const gymLatitude = new Decimal(0)
  const gymLongitude = new Decimal(0)

  const userId = 'user-01'
  const userLatitude = 0
  const userLongitude = 0

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    // ? System under test
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: gymId,
      title: gymTitle,
      description: gymDescription,
      phone: gymPhone,
      latitude: gymLatitude,
      longitude: gymLongitude
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice at the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude
    })

    await expect(() =>
      sut.execute({
        gymId,
        userId,
        userLatitude,
        userLongitude
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice, but at different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    const { checkIn } = await sut.execute({
      gymId,
      userId,
      userLatitude,
      userLongitude
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in, on distant gym', async () => {
    const gymLatitude = new Decimal(-17.7364543)
    const gymLongitude = new Decimal(-48.611364)

    const userLatitude = -17.7581988
    const userLongitude = -48.6468979

    gymsRepository.items.push({
      id: 'gym-02',
      title: gymTitle,
      description: gymDescription,
      phone: gymPhone,
      latitude: gymLatitude,
      longitude: gymLongitude
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId,
        userLatitude,
        userLongitude
      })
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})