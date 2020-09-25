import { boomify, notFound } from '@hapi/boom';
import Controller from '../utilities/Controller';

export default class Vehicles extends Controller {
  public async findAllEntries(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicles = await Vehicle.find();

      if (!vehicles) return notFound('Not found any vehicles');

      return this.reply.send(vehicles);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }

  public async findOneEntry() {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.findById(this.id);

      if (!vehicle) return notFound('Vehicle not found');

      return this.reply.send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.create(this.requestBody);

      return this.reply.code(201).send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }

  public async findOneAndDelete(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.findById(this.id);
      vehicle.remove();

      return this.reply.send('Vehicle deleted');
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }
}
