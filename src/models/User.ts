import { Document, model, Schema } from 'mongoose';
import { FastifyReply } from 'fastify';
import { compare } from 'bcryptjs';

export interface iUserModel extends Document {
  email: string;
  password: string;
  role: Array<string>;
  refreshToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  banned?: boolean;
  verified?: boolean;
  comparePassword(candidatePassword: string): Promise<boolean | void>;
  generateAccessToken(reply: FastifyReply): Promise<string>;
}

const { String, Number, Boolean } = Schema.Types;

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
    resetPasswordExpires: {
      type: Number,
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
};

export default model<iUserModel>('User', userSchema);
