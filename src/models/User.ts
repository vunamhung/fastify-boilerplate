import { Document, model, Schema } from 'mongoose';
import { hashPassword } from '../utilities';

const { String, Boolean, Array } = Schema.Types;

interface iAddressModel extends Document {
  address: string;
  address2: string;
  city: string;
  zipCode: string;
  region: string;
  country: string;
}

export interface iUserModel extends Document {
  email: string;
  password: string;
  role: Array<string>;
  refreshToken: string;
  signupToken?: string;
  resetPasswordToken?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  address?: iAddressModel;
  banned?: boolean;
  verified?: boolean;
}

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
    signupToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    banned: {
      type: Boolean,
    },
    verified: {
      type: Boolean,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    address: [
      {
        address: {
          type: String,
        },
        address2: {
          type: String,
        },
        city: {
          type: String,
        },
        zipCode: {
          type: String,
        },
        region: {
          type: String,
        },
        country: {
          type: String,
        },
      },
    ],
    avatar: {
      type: String,
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
  if (this._update.password) {
    // @ts-ignore
    this._update.password = await hashPassword(this._update.password);
  }

  // @ts-ignore
  next();
});

export default model<iUserModel>('User', userSchema);
