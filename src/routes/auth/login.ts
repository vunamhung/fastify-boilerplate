import { FastifyInstance } from 'fastify';
import { uid } from 'rand-token';
import validator from 'validator';
import User from '../../models/User';
import { iBody, signRefreshToken } from '../../utilities';

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
      const { email, password } = body as iBody;

      if (!validator.isEmail(email)) return reply.badRequest('You must enter an email address.');

      try {
        // check user exists
        let user = await User.findOne({ email });
        if (!user) reply.badRequest('Invalid Credentials');
        if (user.banned) reply.notAcceptable('You banned!');

        // compare password with db user password
        const isMatch = await user.verifyPassword(password);
        if (!isMatch) reply.badRequest('Invalid Credentials.');

        const refreshTokenId = uid(8);
        user.refreshToken = signRefreshToken(refreshTokenId);
        await user.save();

        const token = await reply.jwtSign(
          { id: user.id, email: user.email, role: user.role, verified: user.verified, auth: refreshTokenId },
          { expiresIn: '10m', jwtid: uid(6) },
        );

        reply
          .setCookie('token', token, {
            path: '/',
            secure: !process.env.DEV_ENV, // send cookie over HTTPS only
            httpOnly: true,
            sameSite: true, // alternative CSRF protection
          })
          .send({ success: true, token });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
