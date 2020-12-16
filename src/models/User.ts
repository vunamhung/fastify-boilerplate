import { Document, model, Schema } from 'mongoose';
import { FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';
import { compare } from 'bcryptjs';
import { hashPassword } from '../utilities';

export interface iUserModel extends Document {
  email: string;
  password: string;
  role: Array<string>;
  refreshToken: string;
  resetPasswordToken?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  banned?: boolean;
  verified?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean | void>;
  generateAccessToken(reply: FastifyReply): Promise<string>;
  generateRefreshToken(): Promise<string>;
}

const { String, Boolean } = Schema.Types;

const userSchema = new Schema<iUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, 'Too short, min is 6 characters'],
      required: 'Password is required',
    },
    role: {
      type: Array,
      default: ['member'],
    },
    refreshToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    avatar: {
      type: String,
    },
    info: {
      type: String,
    },
    banned: {
      type: Boolean,
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods = {
  async comparePassword(candidatePassword) {
    return await compare(candidatePassword, this.password).catch(console.log);
  },

  async generateAccessToken(reply) {
    const { id, email, role, banned, verified } = this;

    return await reply.jwtSign({ user: { id, email, role, banned, verified } });
  },

  async generateRefreshToken() {
    const { id, email, role, banned, verified } = this;

    const refreshToken = await jwt.sign({ user: { id, email, role, banned, verified } }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

    let user = await User.findOne({ email });
    user.refreshToken = refreshToken;
    await user.save();

    return refreshToken;
  },
};

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    // @ts-ignore
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  // @ts-ignore
  this._update.password = await hashPassword(this._update.password);

  next();
});

const User = model<iUserModel>('User', userSchema);

export default User;
