import { expect, describe, it } from 'vitest'
import { InMemoryUserRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredencialsError } from './errors/invalid-creadencial-error'

describe('Authenticate Use Case', () => {
  it('should be to authenticate', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUserRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password_hash: await hash('123456', 6),
    })

    expect(() =>
      sut.execute({
        email: 'johndoe@exemple.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredencialsError)
  })
})
