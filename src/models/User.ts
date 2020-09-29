import { Document, Schema, model } from 'mongoose';

const { ObjectId } = Schema.Types;

interface IUserModel extends Document {
  firstName: string;
  lastName?: string;
  username: string;
  password: string;
}

const UserSchema: Schema = new Schema(
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
  {
    timestamps: true,
  },
);

export default model<IUserModel>('User', UserSchema);
