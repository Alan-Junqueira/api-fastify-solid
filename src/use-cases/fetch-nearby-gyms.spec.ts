import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    // ? System under test
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      latitude: -17.7581988,
      longitude: -48.6468979,
      description: null,
      phone: null
    })

    await gymsRepository.create({
      title: 'Far Gym',
      latitude: -17.1221945,
      longitude: -49.4162226,
      description: null,
      phone: null
    })

    const { gyms } = await sut.execute({
      userLatitude: -17.7581988,
      userLongitude: -48.6468979
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Near Gym' }),
    ])
  })
})