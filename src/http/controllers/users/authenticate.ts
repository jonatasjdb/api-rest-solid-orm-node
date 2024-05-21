import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
import { makeAuthenticateUseCase } from '@/use-case/factories/make-authenticate-use-case'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const app = fastify()

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const authenticateUseCase = makeAuthenticateUseCase()

    const {user} = await authenticateUseCase.execute({
      email,
      password,
    })

    const token = await reply.jwtSign({}, {
      sign: {
        sub: user.id
      }
    })

    return reply.status(200).send({ token })

  } catch (err) {
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(400).send({ message: err.message })
    }

    return reply.status(500).send()
  }
}
