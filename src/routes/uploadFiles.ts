import { FastifyInstance } from 'fastify';
import File from '../models/File';
import { uploader } from '../utilities/uploader';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/files',
    {
      preHandler: uploader.array('files', 10),
      schema: {
        tags: ['files'],
        summary: 'Upload files.',
      },
    },
    async (request, reply) => {
      // @ts-ignore
      const { files } = request;

      files.map(async (file) => await File.create(file));

      // @ts-ignore
      reply.send({ success: true, message: 'Files uploaded.', files });
    },
  );
  server.get(
    '/files',
    {
      schema: {
        tags: ['files'],
        summary: 'Upload files form.',
      },
    },
    async (request, reply) => reply.view('/upload'),
  );

  done();
}
