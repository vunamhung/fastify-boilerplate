import { Document, model, Schema } from 'mongoose';

const { ObjectId, Number, String, Array } = Schema.Types;

export interface iCartTotalModel extends Document {
  currencyCode: string;
  currencyDecimalSeparator: string;
  currencyMinorUnit: string;
  currencyPrefix: string;
  currencySuffix: string;
  currencySymbol: string;
  currencyThousandSeparator: string;
  taxLines: Array<string>;
  totalDiscount: number;
  totalDiscountTax: number;
  totalFees: number;
  totalFeesTax: number;
  totalItems: number;
  totalItemsTax: number;
  totalPrice: number;
  totalShipping: number;
  totalShippingTax: number;
  totalTax: number;
}
export interface iCartModel extends Document {
  products: [
    {
      product: string;
      quantity: number;
    },
  ];
  totals: iCartTotalModel;
  calculateTotal(): Function;
}

const schema = new Schema<iCartModel>(
  {
    products: [
      {
        product: {
          type: ObjectId,
          ref: 'Product',
          required: true,
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
  {
    timestamps: true,
  },
);

schema.methods.calculateTotal = function () {
  return this.products.reduce((acc, el) => {
    // @ts-ignore
    acc += el.product?.price * el.quantity;
    return acc;
  }, 0);
};

schema.plugin(require('mongoose-paginate'));

export default model<iCartModel>('Cart', schema);
