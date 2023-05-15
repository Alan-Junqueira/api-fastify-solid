import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  const userId = 'user-01'
  const gymId = 'gym-01'
  const gymId2 = 'gym-02'

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    // ? System under test
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    await checkInsRepository.create({
      gym_id: gymId2,
      user_id: userId,
    })

    const { checkInsCount } = await sut.execute({
      userId,
    })

    expect(checkInsCount).toEqual(2)
  })
})