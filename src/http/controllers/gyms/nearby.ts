import { makeFetchNearbyGymsUseCase } from '@/use-case/factories/make-fetch-nearby-gyms-use-case'
import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export const app = fastify()

export async function nearby(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const nearbyGymsBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  const {latitude, longitude } = nearbyGymsBodySchema.parse(request.body)

  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()

  const { gyms } = await fetchNearbyGymsUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
  })

  return reply.status(200).send({
    gyms
  })
}
