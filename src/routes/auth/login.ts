import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
import { compare } from 'bcryptjs';
import validator from 'validator';
import User from '../../models/User';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/login',
    {
      schema: {
        tags: ['auth'],
        description: 'Authentication endpoint, for all the users, to allow access to protected resources',
        summary: 'Sign in to access protected resources',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              token: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      // @ts-ignore
      const { email, password } = body;

      if (!validator.isEmail(email)) reply.badRequest('You must enter an email address.');

      try {
        // check user exists
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('Invalid Credentials');
        if (user.banned) reply.notAcceptable('You banned!');

        // compare password with db user password
        const isMatch = await compare(password, user.password);
        if (!isMatch) reply.badRequest('Invalid Credentials.');

        const payload = await user.generateRefreshToken();

        reply.send({ success: true, token: await reply.jwtSign(payload, { expiresIn: '10m', jwtid: uid(6) }) });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
