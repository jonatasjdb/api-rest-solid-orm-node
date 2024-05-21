import { UserAlreadyExistsError } from '@/use-case/errors/user-already-exists-error'
import { makeAuthenticateUseCase } from '@/use-case/factories/make-authenticate-use-case'
import { makeCreateGymUseCase } from '@/use-case/factories/make-create-gym-use-case'
import { makeSearchGymsUseCase } from '@/use-case/factories/make-search-gyms-use-case'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const app = fastify()

export async function search(request: FastifyRequest,reply: FastifyReply) {
  const seachGymBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1)
  })

  const { q,page } = seachGymBodySchema.parse(request.body)

  const searchGymsUseCase = makeSearchGymsUseCase()

  await searchGymsUseCase.execute({
    query: q,
    page
  })

  return reply.status(201).send()
}
