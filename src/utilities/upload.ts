import fp from 'fastify-plugin';
import multer, { contentParser, diskStorage } from 'fastify-multer';

const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const [name, ext] = file.originalname.split('.');

    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

export const upload = multer({ storage });

export default fp((server, options, done) => {
  server.register(contentParser);

  done();
});
