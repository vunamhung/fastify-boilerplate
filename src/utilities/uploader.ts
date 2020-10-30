import fp from 'fastify-plugin';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { uid } from 'rand-token';
import multer, { contentParser, diskStorage, memoryStorage } from 'fastify-multer';

const uploadDirs = {
  'image/jpeg': 'public/uploads/images',
  'image/png': 'public/uploads/images',
  'image/webp': 'public/uploads/images',
  'image/svg+xml': 'public/uploads/svg',
  'image/gif': 'public/uploads/gifs',
  'application/msword': 'public/uploads/documents',
  'application/pdf': 'public/uploads/documents',
  'text/csv': 'public/uploads/csv',
  other: 'public/uploads/other-files',
};

function createRandomFileName(originalname) {
  const name: string = uid(16);
  const ext: string = extname(originalname).split('.')[1];

  return name + '.' + ext;
}

function createDestination(mimetype) {
  Object.keys(uploadDirs).forEach((dir) => !existsSync(uploadDirs[dir]) && mkdirSync(uploadDirs[dir], { recursive: true }));

  return uploadDirs[mimetype] ? uploadDirs[mimetype] : uploadDirs['other'];
}

const storage = diskStorage({
  destination: (req, { mimetype }, cb) => cb(null, createDestination(mimetype)),
  filename: (req, { originalname }, cb) => cb(null, createRandomFileName(originalname)),
});

export const uploader = multer({ storage });
export const s3Uploader = multer({ storage: memoryStorage() });

export default fp((server, options, done) => {
  server.register(contentParser);

  done();
});
