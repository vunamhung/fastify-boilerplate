import { Document, Schema, model } from 'mongoose';

export interface iProductModel extends Document {
  sku: string;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
}

const { String, Number, Boolean, ObjectId, Buffer } = Schema.Types;

const productSchema: Schema = new Schema(
  {
    sku: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: { type: String, slug: 'name', unique: true },
    image: {
      data: Buffer,
      contentType: String,
    },
    description: {
      type: String,
      trim: true,
    },
    quantity: {
      type: Number,
    },
    price: {
      type: Number,
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
