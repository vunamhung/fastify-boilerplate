import { FastifyInstance } from 'fastify';
import File from '../models/File';
import { upload } from '../utilities/upload';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/files',
    {
      preHandler: upload.array('files', 10),
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

  done();
}
