import { Product } from '../models/Product';
import Controller from './Controller';

export default class Products extends Controller {
  public async addNewEntry(): Promise<any> {
    try {
      const checkSku = await Product.findOne({ sku: this.requestBody.sku });

      if (checkSku) this.reply.badRequest('This sku is already in use.');

      const product = await Product.create(this.requestBody);

      this.reply.code(201).send(product);
    } catch (error) {
      this.reply.send(error);
    }
  }
}
