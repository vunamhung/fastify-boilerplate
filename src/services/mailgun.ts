import fp from 'fastify-plugin';
import mailgun from 'mailgun-js';

export default fp((server, options, done) => {
  const mg = mailgun({
    domain: process.env.MAILGUN_DOMAIN,
    apiKey: process.env.MAILGUN_API_KEY,
  });

  server.decorate('mailgun', mg.messages());

  done();
});
