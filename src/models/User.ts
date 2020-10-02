import { Document, model, Schema } from 'mongoose';
import { FastifyReply } from 'fastify';
import { compare } from 'bcryptjs';

export interface IUserModel extends Document {
  email: string;
  password: string;
  role: 'member' | 'admin' | 'merchant';
  refreshToken: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(reply: FastifyReply): Promise<string>;
}

const { String, Number } = Schema.Types;

const userSchema: Schema = new Schema(
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
      type: String,
      enum: ['member', 'admin', 'merchant'],
      default: 'member',
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
  },
  {
    timestamps: true,
  },
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await compare(candidatePassword, this.password).catch((err) => console.log(err));
};

userSchema.methods.generateToken = async function (reply: FastifyReply) {
  return await reply.jwtSign({ user: { id: this.id, email: this.email, role: this.role } });
};

export default model<IUserModel>('User', userSchema);
