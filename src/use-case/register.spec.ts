import { it, expect, describe } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password: '12354',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Stark',
      email: 'johnstark@gmail.com',
      password: '12354',
    })

    const isPasswordCorrectlyHashed = await compare('12354', user.password_hash)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(usersRepository)

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
