import Controller from '../utilities/Controller';

export default class Vehicles extends Controller {
  public async findAllEntries(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicles = await Vehicle.aggregate([{ $match: {} }]);

      if (!vehicles) return this.reply.send(404);

      return this.reply.code(200).send(vehicles);
    } catch (error) {
      this.request.log.error(error);
      return this.reply.send(400);
    }
  }

  public async findOneEntry() {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.findOne({ _id: this.id });

      if (!vehicle) return this.reply.send(404);

      return this.reply.code(200).send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      return this.reply.send(400);
    }
  }

  public async addNewEntry(): Promise<any> {
    try {
      const { Vehicle } = this.models;

      const vehicle = await Vehicle.create(this.body);

      return this.reply.code(201).send(vehicle);
    } catch (error) {
      this.request.log.error(error);
      return this.reply.send(500);
    }
  }
}
