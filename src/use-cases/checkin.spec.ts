import { expect, describe, it, beforeEach } from 'vitest'
import { CheckinUseCase } from './checkin'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'

let checkinsRepository: InMemoryCheckinRepository
let sut: CheckinUseCase

describe('Check in Use Case', () => {
  beforeEach(() => {
    checkinsRepository = new InMemoryCheckinRepository()
    sut = new CheckinUseCase(checkinsRepository)
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
