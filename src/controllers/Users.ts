import User from '../models/User';
import Controller from './Controller';
import { compare, genSalt, hash } from 'bcryptjs';

export default class Users extends Controller {
  public async registerUser(): Promise<any> {
    const { email, username, password, info } = this.requestBody;

    try {
      let user = await User.findOne({ email });

      if (user) this.reply.badRequest('User already exists');

      user = new User({
        email,
        username,
        info,
      });

      const salt = await genSalt(10);
      user.password = await hash(password, salt);

      const payload = { user: { id: user.id } };

      console.log('Register user payload => ', payload);

      await user.save();

      try {
        user.token = await this.reply.jwtSign(payload);

        this.reply.status(201).send(user.toAuthJSON());
      } catch (error) {
        this.reply.send(error);
      }
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async loginUser(): Promise<any> {
    const { email, password } = this.requestBody;

    try {
      // check user exists
      let user = await User.findOne({ email });
      if (!user) this.reply.badRequest('Invalid Credentials');

      // compare password with db user password
      const isMatch = await compare(password, user.password);
      if (!isMatch) this.reply.badRequest('Invalid Credentials');

      const payload = { user: { id: user.id } };

      // Add token to user
      try {
        user.token = await this.reply.jwtSign(payload);
        this.reply.setCookie('token', user.token, {
          domain: '*',
          path: '/',
          secure: true,
          httpOnly: true,
          sameSite: true,
        });

        this.reply.status(201).send(user.toAuthJSON());
      } catch (error) {
        this.reply.send(error);
      }
    } catch (error) {
      this.reply.send(error);
    }
  }
}
