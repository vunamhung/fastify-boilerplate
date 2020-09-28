import { Document, Schema, Model, model } from 'mongoose';

export interface IVehicleModel extends Document {
  year: number;
  name: string;
  createdDate: Date;
}

export const VehicleSchema: Schema = new Schema(
  {
    year: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: 'vehicles',
  },
);

export const Vehicle: Model<IVehicleModel> = model<IVehicleModel>('Vehicle', VehicleSchema);
