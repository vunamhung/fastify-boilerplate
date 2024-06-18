import type { ZFastify } from '~/@types';
import en from '~/locales/en';
import vi from '~/locales/vi';
import fp from 'fastify-plugin';
import Polyglot from 'node-polyglot';
import { keys } from 'ramda';

export default fp((fastify: ZFastify, _, done) => {
  fastify.decorate('i18n', new Polyglot());

  fastify.addHook('preParsing', async (req) => {
    const acceptLanguage = req.headers['accept-language']?.split(',')[0];
    const lang = acceptLanguage || 'en';
    const messages = { en, vi };
    const languages = keys(messages);
    const currentLang = languages.find((item) => item.startsWith(lang) || lang.startsWith(item));

    fastify.i18n.locale(currentLang);
    fastify.i18n.extend(messages[currentLang || 'en']);

    req.i18n = fastify.i18n;
  });

  done();
});

declare module 'fastify' {
  export interface FastifyInstance {
    i18n: Polyglot;
  }
  interface FastifyRequest {
    i18n: Polyglot;
  }
}
