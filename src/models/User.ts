import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

interface IUserModel extends Document {
  username: string;
  email: string;
  password: string;
  role: 'member' | 'admin' | 'merchant';
  refreshToken: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  token?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;
  toAuthJSON?: Function;
}

const UserSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      maxlength: [36, 'Too long, max is 36 characters'],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/],
      validate: [validator.isEmail, 'Please provide a valid email'],
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
    refreshToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Number },
    firstName: { type: String },
    lastName: { type: String },
    avatar: { type: String },
    info: { type: String },
  },
  {
    timestamps: true,
  },
);

UserSchema.methods.toAuthJSON = function () {
  return {
    success: true,
    token: `Bearer ${this.token}`,
    user: {
      _id: this._id,
      avatar: this.avatar,
      username: this.username,
      info: this.info,
      email: this.email,
    },
  };
};

export default model<IUserModel>('User', UserSchema);
