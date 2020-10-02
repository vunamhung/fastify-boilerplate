import { Document, Schema, model } from 'mongoose';
import { ICartModel } from './Cart';

interface IOrderModel extends Document {
  cart: ICartModel;
  total: number;
  totalTax?: number;
}

const { ObjectId, Number } = Schema.Types;

const orderSchema: Schema = new Schema(
  {
    cart: {
      type: ObjectId,
      ref: 'Cart',
    },
    total: {
      type: Number,
      default: 0,
    },
    totalTax: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default model<IOrderModel>('Order', orderSchema);
