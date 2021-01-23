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

const schema = new Schema<iFileModel>(
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

schema.plugin(require('mongoose-paginate'));

export default model<iFileModel>('File', schema);
