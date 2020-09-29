import Vehicle from '../models/Vehicle';
import Controller from './Controller';

export default class Vehicles extends Controller {
  public async findAllEntries(): Promise<any> {
    try {
      const vehicles = await Vehicle.find({}, { __v: 0 });

      if (!vehicles) this.reply.notFound('Not found any vehicles');

      this.reply.send(vehicles);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneEntry() {
    try {
      const vehicle = await Vehicle.findById(this.params.id);

      if (!vehicle) this.reply.notFound('Vehicle not found');

      this.reply.send(vehicle);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const vehicle = await Vehicle.create(this.requestBody);

      this.reply.code(201).send(vehicle);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndDelete(): Promise<any> {
    try {
      await Vehicle.deleteOne({ _id: this.params.id });

      this.reply.send('Vehicle deleted');
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndUpdate(): Promise<any> {
    try {
      await Vehicle.findOneAndUpdate({ _id: this.params.id }, this.requestBody);

      this.reply.send(`${this.params.id} is updated`);
    } catch (error) {
      this.reply.send(error);
    }
  }
}
