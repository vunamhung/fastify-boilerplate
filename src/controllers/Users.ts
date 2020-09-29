import User from '../models/User';
import Controller from './Controller';
import { genSalt, hash } from 'bcryptjs';

export default class Users extends Controller {
  public async addNewEntry(): Promise<any> {
    const { email, username, password, info } = this.requestBody;

    try {
      let user = await User.findOne({ email });

      if (user) this.reply.badRequest('User already exists');

      user = new User({ email, username, info });

      const salt = await genSalt(10);
      user.password = await hash(password, salt);

      await user.save();

      user.token = await this.reply.jwtSign({ user: { id: user.id } });

      this.reply.status(201).send(user.toAuthJSON());
    } catch (error) {
      this.reply.send(error);
    }
  }
}
