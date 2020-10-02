import { Document, Schema, model } from 'mongoose';

interface iOptionModel extends Document {
  name: string;
  data: any;
}

const { String, Array } = Schema.Types;

const optionSchema = new Schema<iOptionModel>(
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

export default model<iOptionModel>('Option', optionSchema);
