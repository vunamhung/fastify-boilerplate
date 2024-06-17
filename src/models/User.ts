import type { Document } from 'mongoose';
import { model, Schema } from 'mongoose';

const { String, Boolean } = Schema.Types;

export interface iUserModel extends Document {
  _id: iUser['id'];
  email: iUser['email'];
  password: string;
  role: iUser['role'];
  refreshToken: string;
  signupToken?: string;
  resetPasswordToken?: string;
  fullName?: iUser['fullName'];
  about?: string;
  gender?: iUser['gender'];
  avatar?: string;
  banned?: boolean;
  deleted?: boolean;
  verified?: iUser['verified'];
  verifyPassword(password: string): Function;
}

const schema = new Schema<iUserModel>(
  {
    _id: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
      rounds: 8,
    },
    role: {
      type: String,
      default: 'staff',
    },
    refreshToken: String,
    signupToken: String,
    resetPasswordToken: String,
    banned: Boolean,
    verified: Boolean,
    fullName: String,
    about: String,
    avatar: String,
  },
  {
    timestamps: true,
  },
);

schema.plugin(require('mongoose-bcrypt'));
schema.plugin(require('mongoose-paginate-v2'));
schema.plugin(require('mongoose-delete'), { deletedAt: true, deletedBy: true });

export default model<iUserModel>('User', schema);
