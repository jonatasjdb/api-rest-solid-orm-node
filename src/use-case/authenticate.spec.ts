import { it, expect, describe, beforeEach } from 'vitest'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import { UsersRepository } from '@/repositories/usersRepository'

let usersRepository: UsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
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
    expect(() =>
      authenticateUseCase.execute({
        email: 'johnstark@gmail.com',
        password: '12354',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
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
