import { Document, Schema, Model, model } from 'mongoose';

export interface IVehicleModel extends Document {
  year: number;
  name: string;
  createdDate: Date;
}

export const VehicleSchema: Schema = new Schema(
  {
    year: Number,
    name: String,
    createdDate: { type: Date, default: Date.now },
  },
  { collection: 'vehicles' },
);

export const Vehicle: Model<IVehicleModel> = model<IVehicleModel>('Vehicle', VehicleSchema);
