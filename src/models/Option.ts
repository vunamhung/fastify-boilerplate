import { Document, Schema, model } from 'mongoose';

interface IOptionModel extends Document {
  name: string;
  data: any;
}

const OptionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IOptionModel>('Option', OptionSchema);
