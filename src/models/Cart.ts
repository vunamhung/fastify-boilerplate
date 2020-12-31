import { Document, model, Schema } from 'mongoose';

const { ObjectId, Number } = Schema.Types;

interface iCartItemModel extends Document {
  product: string;
  quantity: number;
}

export interface iCartModel extends Document {
  products: [iCartItemModel];
  total(): number;
}

const cartSchema = new Schema<iCartModel>(
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
  },
  {
    timestamps: true,
  },
);

cartSchema.methods.total = function () {
  return this.products.reduce((acc, el) => {
    acc += el.product?.price * el.quantity;
    return acc;
  }, 0);
};

export default model<iCartModel>('Cart', cartSchema);
