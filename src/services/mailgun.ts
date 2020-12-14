import fp from 'fastify-plugin';
import mailgun from 'mailgun-js';

export default fp((server, options, done) => {
  const { MAILGUN_DOMAIN, MAILGUN_API_KEY } = process.env;

  const mg = mailgun({
    domain: MAILGUN_DOMAIN,
    apiKey: MAILGUN_API_KEY,
  });

  server.decorate('mailgun', mg.messages());

  done();
});
