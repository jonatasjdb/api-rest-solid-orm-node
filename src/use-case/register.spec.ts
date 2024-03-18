import { it, expect, describe, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let registerUseCase: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    registerUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password: '12354',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await registerUseCase.execute({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password: '12354',
    })

    const isPasswordCorrectlyHashed = await compare('12354', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johnstark@example.com'

    await registerUseCase.execute({
      name: 'John Stark',
      email,
      password: '12354',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Stark',
        email,
        password: '12354',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
