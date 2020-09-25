import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IModels } from 'models';

export default abstract class Controller {
  protected server: FastifyInstance<Server, IncomingMessage, ServerResponse>;
  protected request: FastifyRequest;
  protected reply: FastifyReply;
  protected models: IModels;
  protected id;
  protected requestBody;

  constructor(server, request, reply) {
    this.server = server;
    this.request = request;
    this.reply = reply;

    this.models = server.db.models;
    this.id = request.params.id;
    this.requestBody = request.body;
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

  public async findOneAndDelete(): Promise<any> {
    throw new Error('Method not implemented.');
  }

  public async findOneEntry(): Promise<any> {
    throw new Error('Method not implemented.');
  }
}
