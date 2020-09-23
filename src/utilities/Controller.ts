import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Models } from 'models';

export default abstract class Controller {
  protected server: FastifyInstance<Server, IncomingMessage, ServerResponse>;
  protected request: FastifyRequest;
  protected reply: FastifyReply;
  protected models: Models;
  protected id;
  protected body;

  constructor(server, request, reply) {
    this.server = server;
    this.request = request;
    this.reply = reply;

    this.models = server.db.models;
    this.id = request.params.id;
    this.body = request.body;
  }

  public async findAllEntries(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async addNewEntry(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async findOneAndUpdate(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async findOneEntry(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
