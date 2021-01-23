import { Document, model, Schema } from 'mongoose';

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
  verifyPassword(password: string): Function;
}

const schema = new Schema<iUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
      rounds: 8,
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

schema.plugin(require('mongoose-bcrypt'));
schema.plugin(require('mongoose-paginate'));
schema.plugin(require('mongoose-delete'), { deletedAt: true, deletedBy: true });

export default model<iUserModel>('User', schema);
