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
    topLevelDomain: {
      type: Array,
    },
    alpha2Code: {
      type: String,
    },
    alpha3Code: {
      type: String,
    },
    callingCodes: {
      type: Array,
    },
    capital: {
      type: String,
    },
    altSpellings: {
      type: Array,
    },
    region: {
      type: String,
    },
    subregion: {
      type: String,
    },
    population: {
      type: Number,
    },
    latlng: {
      type: Array,
    },
    demonym: {
      type: String,
    },
    area: {
      type: Number,
    },
    gini: {
      type: Number,
    },
    timezones: {
      type: Array,
    },
    borders: {
      type: Array,
    },
    nativeName: {
      type: String,
    },
    numericCode: {
      type: String,
    },
    currencies: {
      type: Array,
    },
    languages: {
      type: Array,
    },
    translations: {
      type: Object,
    },
    flag: {
      type: String,
    },
    regionalBlocs: {
      type: Array,
    },
    cioc: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export default model<iCountryModel>('Country', countrySchema);
