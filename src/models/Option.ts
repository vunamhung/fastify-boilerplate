import { Document, Schema, model } from 'mongoose';

interface IOptionModel extends Document {
  name: string;
  data: any;
}

const { String, Array } = Schema.Types;

const optionSchema: Schema = new Schema(
  {
    name: {
      type: String,
      lowercase: true,
      unique: true,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IOptionModel>('Option', optionSchema);
