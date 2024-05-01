import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkinsRepository: InMemoryCheckinRepository
let sut: GetUserMetricsUseCase

describe('Fetch User Check in History Use Case', () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckinRepository()
    sut = new GetUserMetricsUseCase(checkinsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkinsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkinsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
