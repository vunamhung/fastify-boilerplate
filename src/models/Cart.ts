import { Document, model, Schema } from 'mongoose';

interface iCartItemModel extends Document {
  product: string;
  quantity: number;
}

export interface iCartModel extends Document {
  products: [iCartItemModel];
  total(): number;
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
});

const cartSchema = new Schema<iCartModel>(
  {
    products: [cartItemSchema],
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
