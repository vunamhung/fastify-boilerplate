import { boomify, notFound } from '@hapi/boom';
import Controller from '../utilities/Controller';

export default class Vehicles extends Controller {
  public async findAllEntries(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicles = await Vehicle.aggregate([{ $match: {} }]);

      if (!vehicles) return notFound('Not found any vehicles');

      return this.reply.code(200).send(vehicles);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }

  public async findOneEntry() {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.findOne({ _id: this.id });

      if (!vehicle) return notFound('Vehicle not found');

      return this.reply.code(200).send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.create(this.body);

      return this.reply.code(201).send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      throw boomify(error);
    }
  }
}
