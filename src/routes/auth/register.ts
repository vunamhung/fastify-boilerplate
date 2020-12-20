import { FastifyInstance } from 'fastify';
import { validate } from 'deep-email-validator';
import { isEmpty } from 'ramda';
import PasswordValidator from 'password-validator';
import User from '../../models/User';

const schema = new PasswordValidator();
// prettier-ignore
schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits(2) // Must have at least 2 digits
  .has().not().spaces() // Should not have spaces

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/register',
    {
      schema: {
        tags: ['auth'],
        summary: 'Register a account.',
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
    async ({ params, body }, reply) => {
      // @ts-ignore
      const { email, password } = body;

      try {
        let user = await User.findOne({ email });

        if (user) return reply.badRequest('User already exists.');

        const { valid, reason, validators } = await validate(email);

        if (!valid) return reply.badRequest(validators[reason]?.reason ?? 'Please provide a valid email address.');

        const validPassword: string[] = schema.validate(password, { list: true });

        if (!isEmpty(validPassword)) {
          let message = [];
          validPassword.forEach((item) => {
            if (item === 'min') message.push('Minimum length 8.');
            if (item === 'max') message.push('Maximum length 100.');
            if (item === 'digits') message.push('Must have at least 2 digits.');
            if (item === 'spaces') message.push('Should not have spaces.');
            if (item === 'lowercase') message.push('Must have lowercase letters.');
            if (item === 'uppercase') message.push('Must have uppercase letters.');
          });

          reply.code(400).send({ success: false, message });
          return;
        }

        let newUser = await new User(body);
        await newUser.save();
        const verifyId = await newUser.generateVerifyToken();

        reply.code(201).send({ success: true, message: 'User created.' });
      } catch (err) {
        reply.send(err);
      }
    },
  );

  done();
}
