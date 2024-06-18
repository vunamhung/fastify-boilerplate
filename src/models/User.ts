import type { Document } from 'mongoose';
import { model, PaginateModel, Schema } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseBcrypt from 'mongoose-bcrypt';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

const { String, Boolean } = Schema.Types;

export interface iUserDocument extends Document, iUser {
  password: string;
  refreshToken: string;
  signupToken?: string;
  resetPasswordToken?: string;
  about?: string;
  avatar?: string;
  banned?: boolean;
  deleted?: boolean;
  verifyPassword(password: string): Function;
}

const schema = new Schema<iUserDocument>(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
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

schema.plugin(mongooseBcrypt);
schema.plugin(mongooseAutopopulate);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

export default model<iUserDocument, PaginateModel<iUserDocument>>('User', schema);
