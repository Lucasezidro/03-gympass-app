import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { ValidateCheckinUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkinsRepository: InMemoryCheckinRepository
let sut: ValidateCheckinUseCase

describe('Validate Check in Use Case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckinRepository()
    sut = new ValidateCheckinUseCase(checkinsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
    const createdCheckIn = await checkinsRepository.create({
      gym_id: 'gym_01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkinsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check in', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-checkin-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
