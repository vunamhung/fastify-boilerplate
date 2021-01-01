import { FastifyInstance } from 'fastify';
import User from '../../models/User';
import { iBody, isObjectId, iToken } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/me/wishlist',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'admin', 'member', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'User self add wishlist products.',
        body: {
          type: 'object',
          properties: {
            productId: { type: 'string' },
          },
          required: ['productId'],
        },
        response: {
          201: {
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
      const { id } = user as iToken;

      const { productId } = body as iBody;

      if (!isObjectId(productId)) return reply.badRequest('Wrong product ID!');

      const me = await User.findById(id);

      if (me.wishlistProducts.includes(productId)) reply.badRequest('You already added this item');

      me.wishlistProducts.push(productId);

      await me.save();

      reply.code(201).send({ success: true, message: `Product added to wish List` });
    },
  );

  done();
}
