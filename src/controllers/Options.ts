import Controller from './Controller';
import Option from '../models/Option';

export default class Options extends Controller {
  public async addNewEntry(): Promise<any> {
    try {
      const option = await Option.create(this.reqBody);

      this.reply.code(201).send({
        success: true,
        message: 'Option created',
        option,
      });
    } catch (error) {
      this.reply.send(error);
    }
  }
}
