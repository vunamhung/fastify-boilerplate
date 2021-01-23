import { Document, Schema, model } from 'mongoose';

interface iRegionModel extends Document {
  countryName: string;
  countryShortCode: string;
  regions: Array<object>;
}

const { String, Array } = Schema.Types;

const schema = new Schema<iRegionModel>(
  {
    countryName: String,
    countryShortCode: String,
    regions: Array,
  },
  {
    timestamps: true,
  },
);

schema.plugin(require('mongoose-paginate'));

export default model<iRegionModel>('Region', schema);
