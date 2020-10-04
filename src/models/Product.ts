import { Document, Schema, model } from 'mongoose';

export interface iProductModel extends Document {
  name: string;
  sku: string;
  price: number;
  image: string;
  description: string;
}

const { String, Number, Boolean, ObjectId, Buffer } = Schema.Types;

const productSchema = new Schema<iProductModel>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    sku: {
      type: String,
      required: true,
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

productSchema.plugin(require('mongoose-slug-generator'));

export default model<iProductModel>('Product', productSchema);
