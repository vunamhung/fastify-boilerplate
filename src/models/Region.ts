import { Document, Schema, model } from 'mongoose';

interface iRegionModel extends Document {
  countryName: string;
  countryShortCode: string;
  regions: Array<object>;
}

const { String, Array } = Schema.Types;

const countrySchema = new Schema<iRegionModel>(
  {
    countryName: String,
    countryShortCode: String,
    regions: Array,
  },
  {
    timestamps: true,
  },
);

export default model<iRegionModel>('Region', countrySchema);
