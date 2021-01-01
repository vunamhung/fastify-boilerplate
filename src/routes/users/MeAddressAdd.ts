import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { iBody, iToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/me/address',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'User self add a new address.',
        body: {
          type: 'object',
          properties: {
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            address1: { type: 'string' },
            address2: { type: 'string' },
            city: { type: 'string' },
            postalCode: { type: 'string' },
            phoneNumber: { type: 'number' },
            state: { type: 'string' },
            countryCode: { type: 'string', maxLength: 2 },
            isPrimary: { type: 'boolean' },
          },
          required: ['firstName', 'lastName', 'address1', 'city', 'postalCode', 'state', 'countryCode', 'isPrimary'],
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
      const { isPrimary } = body as iBody;

      const me = await User.findById(id);
      if (me.banned) reply.notAcceptable('You banned!');

      if (isPrimary) me.update({ $set: { 'address.$.isPrimary': false } });

      // @ts-ignore
      me.address.push(body);
      await me.save();

      reply.send({ success: true, message: `User '${email}' is updated address successful!` });
    },
  );

  done();
}
