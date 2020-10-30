import { existsSync, mkdirSync } from 'fs';
import { FastifyInstance } from 'fastify';
import sharp from 'sharp';
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

      files.map(async (file) => {
        await File.create(file);

        // if file is not image, early exit
        if (!['image/jpeg'].includes(file.mimetype)) return;

        const smallDir = file.destination + '/50x50/';
        const thumbDir = file.destination + '/300x300/';
        !existsSync(smallDir) && mkdirSync(smallDir, { recursive: true });
        !existsSync(thumbDir) && mkdirSync(thumbDir, { recursive: true });

        await sharp(file.path)
          .resize(50, 50)
          .toFile(smallDir + file.filename)
          .catch(console.error);
        await sharp(file.path)
          .resize(300, 300)
          .toFile(thumbDir + file.filename)
          .catch(console.error);
      });

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
