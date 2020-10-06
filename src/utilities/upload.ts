import fp from 'fastify-plugin';
import multer, { contentParser, diskStorage } from 'fastify-multer';

const storage = diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => {
    const [name, ...ext] = file.originalname.split('.');

    const finalExt = ext.slice(-1)[0];

    cb(null, `${name}-${Date.now()}.${finalExt}`);
  },
});

export const upload = multer({ storage });

export default fp((server, options, done) => {
  server.register(contentParser);

  done();
});
