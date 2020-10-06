import { Document, Schema, model } from 'mongoose';

interface iFileModel extends Document {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: string;
}

const { String } = Schema.Types;

const optionSchema = new Schema<iFileModel>(
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

export default model<iFileModel>('File', optionSchema);
