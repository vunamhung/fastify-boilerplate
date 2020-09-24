import { Document, Schema, Model, model } from 'mongoose';

export interface IVehicleDocument extends Document {
  year: number;
  name: string;
  createdDate: Date;
}

export interface IVehicleModel extends IVehicleDocument {}

export const VehicleSchema: Schema = new Schema(
  {
    year: Number,
    name: String,
    createdDate: Date,
  },
  { collection: 'vehicles' },
);

VehicleSchema.pre<IVehicleDocument>('save', async function () {
  this.createdDate = new Date();
});

export const Vehicle: Model<IVehicleModel> = model<IVehicleModel>('Vehicle', VehicleSchema);
