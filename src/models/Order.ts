import { Document, Schema, model } from 'mongoose';
import { iCartModel } from './Cart';

interface iOrderModel extends Document {
  cart: iCartModel;
  total: number;
  totalTax?: number;
}

const { Number } = Schema.Types;

const orderSchema = new Schema<iOrderModel>(
  {
    cart: {
      type: Object,
      required: true,
    },
    total: {
      type: Number,
      required: true,
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

export default model<iOrderModel>('Order', orderSchema);
