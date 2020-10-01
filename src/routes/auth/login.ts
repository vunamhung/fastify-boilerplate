import { FastifyInstance, FastifyRequest } from 'fastify';
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
      },
    },
    async (request: FastifyRequest, reply) => {
      // @ts-ignore
      const { email, password } = request.body;

      if (!validator.isEmail(email)) reply.badRequest('You must enter an email address.');

      try {
        // check user exists
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('Invalid Credentials');

        // compare password with db user password
        const isMatch = await compare(password, user.password);
        if (!isMatch) reply.badRequest('Invalid Credentials');

        // Add token to user
        user.token = await reply.jwtSign({ user: { id: user.id, role: user.role } });

        reply.setCookie('token', user.token, { domain: '*', path: '/', secure: true, httpOnly: true, sameSite: true });

        reply.status(200).send(user.toAuthJSON());
      } catch (error) {
        reply.send(error);
      }
    },
  );

  done();
}
