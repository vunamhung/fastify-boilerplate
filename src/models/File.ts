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
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: String,
  },
  {
    timestamps: true,
  },
);

export default model<iFileModel>('File', optionSchema);
