import { Document, model, Schema } from 'mongoose';
import { hashPassword } from '../utilities';

const { String, Boolean, Array, Number, ObjectId } = Schema.Types;

export interface iAddressModel extends Document {
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  countryCode: string;
  isPrimary: boolean;
  phoneNumber?: number;
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
  address?: Array<iAddressModel>;
  wishlistProducts?: Array<string>;
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
    refreshToken: String,
    signupToken: String,
    resetPasswordToken: String,
    banned: Boolean,
    verified: Boolean,
    firstName: String,
    lastName: String,
    address: [
      {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        address1: {
          type: String,
          required: true,
        },
        address2: {
          type: String,
        },
        state: {
          type: String,
          required: true,
        },
        city: {
          type: String,
          required: true,
        },
        postalCode: {
          type: Number,
          required: true,
        },
        countryCode: {
          type: String,
          required: true,
          maxlength: 2,
          uppercase: true,
        },
        phoneNumber: Number,
        isPrimary: {
          type: Boolean,
          required: true,
        },
      },
    ],
    wishlistProducts: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
        },
      },
    ],
    avatar: String,
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
