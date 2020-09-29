import Controller from '../utilities/Controller';

export default class Products extends Controller {
  protected Product = this.models.Product;

  public async addNewEntry(): Promise<any> {
    try {
      const checkSku = await this.Product.findOne({ sku: this.requestBody.sku });

      if (checkSku) this.reply.badRequest('This sku is already in use.');

      const product = await this.Product.create(this.requestBody);

      this.reply.code(201).send(product);
    } catch (error) {
      this.reply.send(error);
    }
  }
}
