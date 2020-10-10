import { FastifyInstance } from 'fastify';
import validator from 'validator';
import Option from '../../models/Option';
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

        // check ban status
        const banUsers = await Option.findOne({ name: 'ban_users' });

        if (banUsers?.data?.includes(email)) {
          user.banned = true;
        } else {
          // compare password with db user password
          const isMatch: boolean | void = await user.comparePassword(password);
          if (!isMatch) reply.badRequest('Invalid Credentials');
        }

        // Add token to user
        const token: string = await user.generateToken(reply);

        reply.send({ success: true, token });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
