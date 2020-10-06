import fp from 'fastify-plugin';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';
import multer, { contentParser, diskStorage } from 'fastify-multer';
import { File } from 'fastify-multer/src/interfaces';

const uploadDirs = {
  png: 'public/uploads/images',
  jpg: 'public/uploads/images',
  jpeg: 'public/uploads/images',
  gif: 'public/uploads/gifs',
  doc: 'public/uploads/documents',
  docx: 'public/uploads/documents',
  other: 'public/uploads/other-files',
};

const createRandomFileName = ({ originalname }: File) => {
  const name: string = randomBytes(18).toString('hex');
  const ext: string = extname(originalname).split('.')[1];

  return name + '.' + ext;
};

const storage = diskStorage({
  destination: (req, { originalname }, cb) => {
    Object.keys(uploadDirs).forEach((dir) => !existsSync(uploadDirs[dir]) && mkdirSync(uploadDirs[dir], { recursive: true }));

    const ext = extname(originalname).split('.')[1];
    cb(null, uploadDirs[ext] ? uploadDirs[ext] : uploadDirs['other']);
  },
  filename: (req, file, cb) => cb(null, createRandomFileName(file)),
});

export const uploader = multer({ storage });

export default fp((server, options, done) => {
  server.register(contentParser);

  done();
});
