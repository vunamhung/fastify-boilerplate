import { Document, Schema, model } from 'mongoose';

interface IUserModel extends Document {
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
}

const { String, Number } = Schema.Types;

const UserSchema: Schema = new Schema(
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

export default model<IUserModel>('User', UserSchema);
