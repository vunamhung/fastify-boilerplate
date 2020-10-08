import { Document, Schema, model } from 'mongoose';

interface iRegionModel extends Document {
  countryName: string;
  countryShortCode: string;
  regions: Array<object>;
}

const { String, Array } = Schema.Types;

const countrySchema = new Schema<iRegionModel>(
  {
    countryName: {
      type: String,
    },
    countryShortCode: {
      type: String,
    },
    regions: {
      type: Array,
    },
  },
  {
    timestamps: true,
  },
);

export default model<iRegionModel>('Region', countrySchema);
