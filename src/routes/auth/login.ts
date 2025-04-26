import type { ZFastify } from '~/@types';
import User from '~/models/User';
import { loginSuccess, responseError, userSchema } from '~/schema';
import { cookieOptions, expiresIn } from '~/utils';
import { compareSync } from 'bcryptjs';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';

export default function (fastify: ZFastify, _, done) {
  fastify.route({
    method: 'POST',
    url: '/login',
    schema: {
      tags: ['auth'],
      description: 'Authentication endpoint, for all the users, to allow access to protected resources',
      summary: 'Sign in',
      body: userSchema.pick({ username: true, password: true }),
      response: {
        200: loginSuccess,
        default: responseError,
      },
    },
    handler: async ({ body: { username, password } }, reply) => {
      const user = await User.findOne({ username, deleted: false });
      if (!user) return reply.badRequest('Invalid Credentials');

      const isMatch = compareSync(password, user.password);
      if (!isMatch) return reply.badRequest('Invalid Credentials!');

      const { email, fullName, role } = user;

      const jti = nanoid(15);
      const token = await reply.jwtSign({ username, email, fullName, role }, { expiresIn, jti });

      reply.setCookie('token', token, cookieOptions).send({ token, expiration: dayjs().add(expiresIn, 's') });

      user.refreshToken = await reply.jwtSign({}, { expiresIn: '30d', jti });
      await user.save();
    },
  });

  done();
}
