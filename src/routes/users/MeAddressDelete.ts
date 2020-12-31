import { FastifyInstance } from 'fastify';
import { isEmpty } from 'ramda';
import { iParams, isObjectId, iToken } from '../../utilities';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.delete(
    '/me/address/:addressId',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['options'],
        security: [{ apiKey: [] }],
        summary: 'Delete a address by id.',
        params: {
          type: 'object',
          properties: {
            addressId: {
              type: 'string',
              description: 'Address ID',
            },
          },
        },
      },
    },
    async ({ user, params }, reply) => {
      const { addressId } = params as iParams;
      const { id } = user as iToken;

      if (!isObjectId(addressId)) return reply.badRequest('Wrong address ID!');

      const me = await User.findById(id);

      const newAddress = me.address.filter(({ _id }) => _id != addressId);

      if (isEmpty(newAddress)) return reply.badRequest('Wrong address ID.');

      me.address = newAddress;
      await me.save();

      reply.notFound(`Address deleted!`);
    },
  );

  done();
}
