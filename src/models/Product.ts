import { Document, Schema, model } from 'mongoose';

export interface iProductModel extends Document {
  name: string;
  sku: string;
  price: number;
  image: string;
  description: string;
}

const { String, Number, Boolean, ObjectId, Buffer } = Schema.Types;

const schema = new Schema<iProductModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    slug: {
      type: String,
      slug: 'name',
      unique: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
    },
    taxable: {
      type: Boolean,
      default: false,
    },
    brand: {
      type: ObjectId,
      ref: 'Brand',
    },
  },
  {
    timestamps: true,
  },
);

schema.plugin(require('mongoose-slug-generator'));
schema.plugin(require('mongoose-paginate'));

export default model<iProductModel>('Product', schema);
