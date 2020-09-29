import Controller from '../utilities/Controller';

export default class Vehicles extends Controller {
  protected Vehicle = this.models.Vehicle;

  public async findAllEntries(): Promise<any> {
    try {
      const vehicles = await this.Vehicle.find({}, { __v: 0 });

      if (!vehicles) this.reply.notFound('Not found any vehicles');

      this.reply.send(vehicles);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneEntry() {
    try {
      const vehicle = await this.Vehicle.findById(this.params.id);

      if (!vehicle) this.reply.notFound('Vehicle not found');

      this.reply.send(vehicle);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const vehicle = await this.Vehicle.create(this.requestBody);

      this.reply.code(201).send(vehicle);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndDelete(): Promise<any> {
    try {
      await this.Vehicle.deleteOne({ _id: this.params.id });

      this.reply.send('Vehicle deleted');
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndUpdate(): Promise<any> {
    try {
      await this.Vehicle.findOneAndUpdate({ _id: this.params.id }, this.requestBody);

      this.reply.send(`${this.params.id} is updated`);
    } catch (error) {
      this.reply.send(error);
    }
  }
}
