import { FastifyInstance, FastifyRequest } from 'fastify';
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
        const isMatch: boolean = await user.comparePassword(password);
        if (!isMatch) reply.badRequest('Invalid Credentials');

        // Add token to user
        const token: string = await user.generateToken(reply);

        reply.setCookie('token', token, { domain: '*', path: '/', secure: true, httpOnly: true, sameSite: true });

        reply.send({ success: true, token });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
