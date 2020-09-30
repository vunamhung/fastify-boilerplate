import Product from '../models/Product';
import Controller from './Controller';

export default class Products extends Controller {
  public async addNewEntry(): Promise<any> {
    try {
      const checkSku = await Product.findOne({ sku: this.reqBody.sku });

      if (checkSku) this.reply.badRequest('This sku is already in use.');

      const product = await Product.create(this.reqBody);

      this.reply.code(201).send({ success: true, message: 'Product created', product });
    } catch (error) {
      this.reply.send(error);
    }
  }
}
