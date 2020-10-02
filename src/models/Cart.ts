import { Document, Schema, model } from 'mongoose';
import { iProductModel } from './Product';

interface iCartItemModel extends Document {
  product: iProductModel;
  quantity: number;
  totalPrice: number;
  priceWithTax?: number;
}

export interface iCartModel extends Document {
  products: [iCartItemModel];
}

const { ObjectId, Number } = Schema.Types;

const cartItemSchema: Schema = new Schema({
  product: {
    type: ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  priceWithTax: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const cartSchema: Schema = new Schema(
  {
    products: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

export default model<iCartModel>('Cart', cartSchema);
