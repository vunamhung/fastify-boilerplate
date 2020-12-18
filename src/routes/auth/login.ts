import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
import jwt from 'jsonwebtoken';
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
            mail: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['mail', 'password'],
        },
        response: {
          200: {
            description: 'Success',
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              accessToken: { type: 'string' },
            },
          },
        },
      },
    },
    async ({ body }, reply) => {
      // @ts-ignore
      const { mail, password } = body;

      if (!validator.isEmail(mail)) reply.badRequest('You must enter an email address.');

      try {
        // check user exists
        let user = await User.findOne({ email: mail });
        if (!user) reply.badRequest('Invalid Credentials');

        // check ban status
        const banUsers = await Option.findOne({ name: 'ban_users' });

        if (banUsers?.data?.includes(mail)) {
          user.banned = true;
        } else {
          // compare password with db user password
          const isMatch: boolean | void = await user.comparePassword(password);
          if (!isMatch) reply.badRequest('Invalid Credentials.');
        }

        const { id, email, role, banned, verified } = user;
        const jti = uid(8);
        const payload = { user: { id, email, role, banned, verified, auth: jti } };

        // Add refresh token to user
        user.refreshToken = await jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', jwtid: jti });
        await user.save();

        reply.send({ success: true, accessToken: await reply.jwtSign(payload, { expiresIn: '10m', jwtid: uid(6) }) });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
