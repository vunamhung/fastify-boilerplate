import { existsSync, mkdirSync } from 'fs';
import { FastifyInstance } from 'fastify';
import AWS from 'aws-sdk';
import sharp from 'sharp';
import File from '../models/File';
import { s3Uploader, uploader } from '../utilities/uploader';

export default function (server: FastifyInstance, options, done) {
  server.post(
    '/s3',
    {
      preHandler: s3Uploader.array('files', 10),
      schema: {
        tags: ['files'],
        summary: 'Upload files to Amazon S3.',
      },
    },
    async (request, reply) => {
      // @ts-ignore
      const { files } = request;

      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      });

      files.map(async (file) => {
        await File.create(file);
        s3.upload(
          {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read',
          },
          function (err, data) {},
        );
      });

      // @ts-ignore
      reply.send({ success: true, message: 'Files uploaded to S3.', files });
    },
  );
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
