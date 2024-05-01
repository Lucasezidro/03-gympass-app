import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { CheckinUseCase } from './checkin'
import { InMemoryCheckinRepository } from '@/repositories/in-memory/in-memory-check-in-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberOfCheckins } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkinsRepository: InMemoryCheckinRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckinUseCase

describe('Check in Use Case', () => {
  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckinRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkinsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -23.7436928,
      longitude: -46.4748544,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.7436928,
      userLongitude: -46.4748544,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.7436928,
      userLongitude: -46.4748544,
    })

    await expect(
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -23.7436928,
        userLongitude: -46.4748544,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckins)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.7436928,
      userLongitude: -46.4748544,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -23.7436928,
      userLongitude: -46.4748544,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-23.7867396),
      longitude: new Decimal(-46.2879152),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-02',
        userId: 'user-01',
        userLatitude: -23.7436928,
        userLongitude: -46.4748544,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
