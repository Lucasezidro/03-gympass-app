import { makeValidateCheckinUseCase } from '@/use-cases/factories/make-validate-check-in-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const validateCheckinParamsSchema = z.object({
    checkInId: z.string().uuid(),
  })

  const { checkInId } = validateCheckinParamsSchema.parse(request.params)

  const validatecheckInUseCase = makeValidateCheckinUseCase()

  await validatecheckInUseCase.execute({
    checkInId,
  })

  return reply.status(204).send()
}
