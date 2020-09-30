import { compare, genSalt, hash } from 'bcryptjs';
import { uid } from 'rand-token';
import validator from 'validator';
import User from '../models/User';
import Controller from './Controller';

export default class Auth extends Controller {
  public async loginUser(): Promise<any> {
    const { email, password } = this.requestBody;

    if (!validator.isEmail(email)) this.reply.badRequest('You must enter an email address.');

    try {
      // check user exists
      let user = await User.findOne({ email });
      if (!user) this.reply.badRequest('Invalid Credentials');

      // compare password with db user password
      const isMatch = await compare(password, user.password);
      if (!isMatch) this.reply.badRequest('Invalid Credentials');

      // Add token to user
      user.token = await this.reply.jwtSign({ user: { id: user.id } });

      this.reply.setCookie('refreshToken', user.refreshToken, { domain: '*', path: '/', secure: true, httpOnly: true, sameSite: true });
      this.reply.setCookie('token', user.token, { domain: '*', path: '/', secure: true, httpOnly: true, sameSite: true });

      this.reply.status(200).send(user.toAuthJSON());
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async resetPasswordByToken(): Promise<any> {
    const { password } = this.requestBody;

    try {
      let user = await User.findOne({
        resetPasswordToken: this.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) this.reply.badRequest('Your token has expired. Please attempt to reset your password again.');

      const salt = await genSalt(10);
      user.password = await hash(password, salt);

      await user.save();

      this.reply.code(200).send({
        success: true,
        message: 'Password changed successfully. Please login with your new password.',
      });
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async forgotPassword(): Promise<any> {
    const { email } = this.requestBody;

    if (!validator.isEmail(email)) this.reply.badRequest('You must enter an email address.');

    try {
      let user = await User.findOne({ email });
      if (!user) this.reply.badRequest('No user exist with this email.');

      user.resetPasswordToken = uid(64);
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();

      this.reply.code(200).send({
        success: true,
        message: 'Please check your email for the link to reset your password.',
      });
    } catch (error) {
      this.reply.send(error);
    }
  }

  public logout() {
    this.reply.clearCookie('token');
    this.reply.clearCookie('refreshToken');

    this.reply.code(200).send();
  }
}
