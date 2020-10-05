import { Document, Schema, model } from 'mongoose';

interface iMediaModel extends Document {
  name: string;
  data: any;
}

const { String } = Schema.Types;

const optionSchema = new Schema<iMediaModel>(
  {
    fieldname: {
      type: String,
    },
    originalname: {
      type: String,
    },
    encoding: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    destination: {
      type: String,
    },
    filename: {
      type: String,
    },
    path: {
      type: String,
    },
    size: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<iMediaModel>('Media', optionSchema);
