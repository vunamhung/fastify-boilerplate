import { Document, model, Schema } from 'mongoose';
import { hashPassword } from '../utilities';
import { uid } from 'rand-token';
import jwt from 'jsonwebtoken';

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
  generateVerifyToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
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

userSchema.methods = {
  async generateVerifyToken() {
    const { email } = this;

    let user = await User.findOne({ email });
    user.verifyToken = jwt.sign({ user: { email } }, process.env.VERIFY_TOKEN_SECRET, { expiresIn: '1d' });
    await user.save();

    return user.verifyToken;
  },

  async generateRefreshToken() {
    const { id, email, role, verified } = this;
    const jti = uid(8);
    const payload = { user: { id, email, role, verified, auth: jti } };

    let user = await User.findOne({ email });
    user.refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d', jwtid: jti });
    await user.save();

    return payload;
  },
};

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

const User = model<iUserModel>('User', userSchema);

export default User;
