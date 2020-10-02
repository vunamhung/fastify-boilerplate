import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

import statusRoutes from '../src/routes/status';

describe('/', () => {
  let server: FastifyInstance<Server, IncomingMessage, ServerResponse>;

  beforeAll(() => {});

  beforeEach(async () => {
    server = fastify({});
    server.register(statusRoutes);
    await server.ready();

    jest.clearAllMocks();
  });

  it('GET returns 200', async (done) => {
    const response = await server.inject({ method: 'GET', url: '/' });
    expect(response.statusCode).toEqual(200);
    const payload: { date: Date; works: boolean } = JSON.parse(response.payload);
    expect(payload).toMatchSnapshot({ date: expect.any(String), works: true });

    done();
  });

  it('POST returns 404', async (done) => {
    const response = await server.inject({ method: 'POST', url: '/' });
    expect(response.statusCode).toEqual(404);
    expect(response.payload).toMatchSnapshot();

    done();
  });
});
