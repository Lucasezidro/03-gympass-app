import { Checkin, Prisma } from '@prisma/client'

export interface CheckInsRepository {
  findById(id: string): Promise<Checkin | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>
  countByUserId(userId: string): Promise<number>
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
  save(checkIn: Checkin): Promise<Checkin>
}
