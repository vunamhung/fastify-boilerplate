import { FastifyInstance } from 'fastify';
import Media from '../models/Media';
import { upload } from '../utilities/upload';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/media',
    {
      preHandler: upload.array('media', 10),
      schema: {
        tags: ['media'],
        summary: 'Upload a media file.',
      },
    },
    async (request, reply) => {
      // @ts-ignore
      request.files.map(async (file) => await Media.create(file));

      // @ts-ignore
      reply.send({ success: true, message: 'Media uploaded.', media: request.files });
    },
  );

  done();
}
