import { Document, Schema, model } from 'mongoose';
import { iCartModel } from './Cart';

export interface iOrderModel extends Document {
  cart: iCartModel;
  total: number;
  totalTax?: number;
}

const { Number, String, ObjectId } = Schema.Types;

const orderSchema = new Schema<iOrderModel>(
  {
    cart: {
      products: [
        {
          product: {
            _id: {
              type: ObjectId,
              required: true,
            },
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
          },
          quantity: {
            type: Number,
            required: true,
          },
        },
      ],
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
