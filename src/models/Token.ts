import { Document, Schema, model } from 'mongoose';

interface iTokenModel extends Document {
  token: string;
  email: string;
}

const { String } = Schema.Types;

const optionSchema = new Schema<iTokenModel>(
  {
    token: {
      type: String,
      required: true,
    },
    email: { type: String },
  },
  {
    timestamps: true,
  },
);

export default model<iTokenModel>('Token', optionSchema);
