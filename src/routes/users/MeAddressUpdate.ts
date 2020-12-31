import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { compare } from 'bcryptjs';
import User, { iAddressModel } from '../../models/User';
import { iBody, iToken, validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/me/address',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'User self update address.',
        body: {
          type: 'object',
          properties: {
            address: { type: 'string' },
            address2: { type: 'string' },
            city: { type: 'string' },
            zipCode: { type: 'string' },
            region: { type: 'string' },
            country: { type: 'string' },
          },
          required: ['address', 'city', 'zipCode', 'region', 'country'],
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ user, body }, reply) => {
      const { email, id } = user as iToken;

      const me = await User.findById(id);
      // @ts-ignore
      me.address.push(body);
      await me.save();

      reply.send({ success: true, message: `User '${email}' is updated address successful!` });
    },
  );

  done();
}
