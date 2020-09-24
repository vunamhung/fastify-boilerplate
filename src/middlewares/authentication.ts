import { FastifyReply, FastifyRequest } from 'fastify';
import { unauthorized, forbidden } from '@hapi/boom';

/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function determineAccountAndUser(server, request) {
  const auth = request.headers['authorization'] as string;
  try {
    const token = auth.split(' ')[1];

    return server.utils.verify(token);
  } catch {
    return null;
  }
}

/**
 * Pre-handler hook,
 *  - Protect all resources accessible to engineers only
 *
 * @export
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @param {(err?: Error) => void} done
 */
export function protectUserRoute(request, reply, done) {
  const auth = request.headers['authorization'] as string;

  if (!auth) {
    throw unauthorized('Missing authentication token');
  }

  const { account, email, id } = determineAccountAndUser(this, request);

  if (account !== 'account1') {
    throw forbidden('Invalid credentials in authentication token');
  }

  return done();
}

/**
 * Allow authorized user to access resource, without narrowing scope to role/account
 *
 * @export
 * @param {FastifyRequest} request
 * @param {FastifyReply} reply
 * @param {(err?: Error) => void} done
 * @returns
 */
export function protectAuthorizedUser(request, reply, done) {
  const auth = request.headers['authorization'] as string;

  if (!auth) {
    throw unauthorized('Missing authentication token');
  }

  const { account, email, id } = determineAccountAndUser(this, request);

  if (!account) {
    throw forbidden('Invalid credentials in authentication token');
  }

  return done();
}
