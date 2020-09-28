import { Document, Schema, Model, model } from 'mongoose';

const { ObjectId } = Schema.Types;

export interface IProductModel extends Document {
  sku: string;
  name: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
}

export const ProductSchema: Schema = new Schema(
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
    updated: Date,
  },
  {
    timestamps: true,
  },
);

ProductSchema.plugin(require('mongoose-slug-generator'));
export const Product: Model<IProductModel> = model<IProductModel>('Product', ProductSchema);
