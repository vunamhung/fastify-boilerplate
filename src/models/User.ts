import { Document, Schema, Model, model } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface IUserModel extends Document {
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
}

export const UserSchema: Schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    username: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    company: {
      type: ObjectId,
      ref: 'Company',
      required: true,
    },
    gender: {
      type: Number,
      enum: [0, 1],
      default: 0,
      required: true,
    },
  },
  { collection: 'users' },
);

UserSchema.plugin(() => import('mongoose-slug-generator'));
export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
