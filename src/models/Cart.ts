import { Document, Schema, model } from 'mongoose';

interface iCartItemModel extends Document {
  product: string;
  quantity: number;
  totalPrice?: number;
  priceWithTax?: number;
}

export interface iCartModel extends Document {
  products: [iCartItemModel];
}

const { ObjectId, Number } = Schema.Types;

const cartItemSchema = new Schema<iCartItemModel>({
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
    min: 0,
  },
  priceWithTax: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const cartSchema = new Schema<iCartModel>(
  {
    products: [cartItemSchema],
  },
  {
    timestamps: true,
  },
);

export default model<iCartModel>('Cart', cartSchema);
