import { Document, Schema, model } from 'mongoose';
import { iCartModel } from './Cart';

export interface iOrderModel extends Document {
  cart: iCartModel;
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
      totals: {
        currencyCode: {
          type: String,
          uppercase: true,
          maxlength: 3,
          default: 'USD',
        },
        currencyDecimalSeparator: {
          type: String,
          default: '.',
        },
        currencyMinorUnit: {
          type: Number,
          default: 2,
        },
        currencyPrefix: {
          type: String,
          default: '$',
        },
        currencySuffix: String,
        currencySymbol: {
          type: String,
          default: '$',
        },
        currencyThousandSeparator: {
          type: String,
          default: ',',
        },
        taxLines: Array,
        totalDiscount: {
          type: Number,
          default: 0,
        },
        totalDiscountTax: {
          type: Number,
          default: 0,
        },
        totalFees: {
          type: Number,
          default: 0,
        },
        totalFeesTax: {
          type: Number,
          default: 0,
        },
        totalItems: {
          type: Number,
          default: 0,
        },
        totalItemsTax: {
          type: Number,
          default: 0,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
        totalShipping: {
          type: Number,
          default: 0,
        },
        totalShippingTax: {
          type: Number,
          default: 0,
        },
        totalTax: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  {
    timestamps: true,
  },
);

export default model<iOrderModel>('Order', orderSchema);
