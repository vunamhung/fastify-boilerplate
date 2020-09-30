import { FastifyInstance } from 'fastify';
import Options from '../controllers/Options';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/options',
    {
      preValidation: [server.authenticate],
    },
    async (request, reply) => new Options(server, request, reply).addNewEntry(),
  );

  done();
}
