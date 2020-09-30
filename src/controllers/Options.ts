import Controller from './Controller';
import Option from '../models/Option';

export default class Options extends Controller {
  public async addNewEntry(): Promise<any> {
    try {
      const option = await Option.create(this.requestBody);

      this.reply.code(201).send(option);
    } catch (error) {
      this.reply.send(error);
    }
  }
}
