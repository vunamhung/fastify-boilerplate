import { Document, model, Schema } from 'mongoose';
import { hashPassword } from '../utilities';

export interface iUserModel extends Document {
  email: string;
  password: string;
  role: Array<string>;
  refreshToken: string;
  verifyToken?: string;
  resetPasswordToken?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  info?: string;
  banned?: boolean;
  verified?: boolean;
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
    verifyToken: {
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

  // @ts-ignore
  next();
});

export default model<iUserModel>('User', userSchema);
