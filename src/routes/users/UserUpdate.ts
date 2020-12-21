import { FastifyInstance } from 'fastify';
import validator from 'validator';
import { isEmpty } from 'ramda';
import User from '../../models/User';
import { validatePassword } from '../../utilities';

export default function (server: FastifyInstance, options, done) {
  server.put(
    '/:email',
    {
      preValidation: [server.authenticate, server.guard.role('root', 'user:write')],
      schema: {
        tags: ['users'],
        security: [{ apiKey: [] }],
        summary: 'Update user by email.',
        params: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
          },
        },
        body: {
          type: 'object',
          properties: {
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            role: { type: 'array' },
          },
        },
      },
    },
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { email } = params;
      // @ts-ignore
      const { password } = body;

      if (!validator.isEmail(email)) reply.badRequest('Please provide a valid email');

      if (!isEmpty(password) && password != undefined) {
        const invalidPasswordMessage = await validatePassword(password);
        if (!isEmpty(invalidPasswordMessage)) {
          reply.code(400).send({ success: false, message: invalidPasswordMessage });
          return;
        }
      }

      const result = await User.findOneAndUpdate({ email }, body).catch((err) => reply.send(err));

      if (result) reply.send({ success: true, message: `User ${email} updated.` });

      reply.notFound(`User ${email} not found.`);
    },
  );

  done();
}
