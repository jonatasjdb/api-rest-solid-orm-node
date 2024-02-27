import { it, expect, describe } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password_hash: await hash('12354', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'johnstark@gmail.com',
      password: '12354',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    expect(() =>
      authenticateUseCase.execute({
        email: 'johnstark@gmail.com',
        password: '12354',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password_hash: await hash('123545', 6),
    })

    expect(() =>
      authenticateUseCase.execute({
        email: 'johnstark@gmail.com',
        password: '12354',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
