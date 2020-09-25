import Controller from '../utilities/Controller';

export default class Products extends Controller {
  public async findAllEntries(): Promise<any> {
    const [rows] = await this.db.query('SELECT * FROM wp_posts WHERE post_type = "product" ');
    this.reply.send(rows);
  }
}
