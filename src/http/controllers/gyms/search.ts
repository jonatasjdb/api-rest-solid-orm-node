import { makeSearchGymsUseCase } from '@/use-case/factories/make-search-gyms-use-case'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const app = fastify()

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const seachGymBodySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q, page } = seachGymBodySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    query: q,
    page,
  })

  return reply.status(200).send({
    gyms,
  })
}
