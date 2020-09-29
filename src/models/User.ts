import { Document, Schema, model } from 'mongoose';
import validator from 'validator';

interface IUserModel extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  token?: string;
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

UserSchema.methods.toAuthJSON = function () {
  return {
    _id: this._id,
    avatar: this.avatar,
    username: this.username,
    info: this.info,
    email: this.email,
    token: this.token,
  };
};

export default model<IUserModel>('User', UserSchema);
