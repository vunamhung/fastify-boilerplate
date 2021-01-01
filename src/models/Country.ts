import { Document, Schema, model } from 'mongoose';

interface iCountryModel extends Document {
  name: string;
  topLevelDomain: Array<string>;
  alpha2Code: string;
  alpha3Code: string;
  callingCodes: Array<string>;
  capital: string;
  altSpellings: Array<string>;
  region: string;
  subregion: string;
  population: number;
  latlng: Array<number>;
  demonym: string;
  area: number;
  gini: number;
  timezones: Array<string>;
  borders: Array<string>;
  nativeName: string;
  numericCode: string;
  currencies: Array<string>;
  languages: Array<object>;
  translations: object;
  flag: string;
  regionalBlocs: Array<object>;
  cioc: string;
}

const { String, Array, Number } = Schema.Types;

const countrySchema = new Schema<iCountryModel>(
  {
    name: {
      type: String,
      required: true,
    },
    topLevelDomain: Array,
    alpha2Code: String,
    alpha3Code: String,
    callingCodes: Array,
    capital: String,
    altSpellings: Array,
    region: String,
    subregion: String,
    population: Number,
    latlng: Array,
    demonym: String,
    area: Number,
    gini: Number,
    timezones: Array,
    borders: Array,
    nativeName: String,
    numericCode: String,
    currencies: Array,
    languages: Array,
    translations: Object,
    flag: String,
    regionalBlocs: Array,
    cioc: String,
  },
  {
    timestamps: true,
  },
);

export default model<iCountryModel>('Country', countrySchema);
