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
      const vehicle = await Vehicle.findById(this.reqParams.id);

      if (!vehicle) this.reply.notFound('Vehicle not found');

      this.reply.send(vehicle);
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const vehicle = await Vehicle.create(this.reqBody);

      this.reply.code(201).send({
        success: true,
        message: 'Vehicle created',
        vehicle,
      });
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndDelete(): Promise<any> {
    try {
      await Vehicle.deleteOne({ _id: this.reqParams.id });

      this.reply.send({
        success: true,
        message: 'Vehicle deleted',
      });
    } catch (error) {
      this.reply.send(error);
    }
  }

  public async findOneAndUpdate(): Promise<any> {
    try {
      await Vehicle.findOneAndUpdate({ _id: this.reqParams.id }, this.reqBody);

      this.reply.send({
        success: true,
        message: `${this.reqParams.id} is updated`,
      });
    } catch (error) {
      this.reply.send(error);
    }
  }
}
