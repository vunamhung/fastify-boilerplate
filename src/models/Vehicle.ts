import { Document, Schema, model } from 'mongoose';

interface IVehicleModel extends Document {
  year: number;
  name: string;
}

const VehicleSchema: Schema = new Schema(
  {
    year: { type: Number, required: true },
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export default model<IVehicleModel>('Vehicle', VehicleSchema);
