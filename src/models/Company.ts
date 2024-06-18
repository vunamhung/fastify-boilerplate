import type { iCompany } from '~/@types/company';
import type { Document } from 'mongoose';
import { model, PaginateModel, Schema } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

const { String, Boolean, ObjectId, Number } = Schema.Types;

export interface iCompanyDocument extends Document, iCompany {}

const schema = new Schema<iCompanyDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    legalName: {
      type: String,
      trim: true,
    },
    hasParentCompany: {
      type: Boolean,
      default: false,
    },
    parentCompany: {
      type: ObjectId,
      ref: 'Company',
    },
    isClient: {
      type: Boolean,
      default: false,
    },
    peoples: [
      {
        type: ObjectId,
        ref: 'People',
        autopopulate: true,
      },
    ],
    mainContact: {
      type: ObjectId,
      ref: 'People',
      autopopulate: true,
    },
    icon: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      trim: true,
    },
    imageHeader: String,
    bankName: {
      type: String,
      trim: true,
    },
    bankIban: {
      type: String,
      trim: true,
    },
    bankSwift: {
      type: String,
      trim: true,
    },
    bankNumber: {
      type: String,
      trim: true,
    },
    bankRouting: {
      type: String,
      trim: true,
    },
    bankCountry: {
      type: String,
      trim: true,
    },
    companyRegNumber: {
      type: String,
      trim: true,
    },
    companyTaxNumber: {
      type: String,
      trim: true,
    },
    companyTaxId: {
      type: String,
      trim: true,
    },
    companyRegId: {
      type: String,
      trim: true,
    },
    customField: [
      {
        fieldName: {
          type: String,
          trim: true,
          lowercase: true,
        },
        fieldType: {
          type: String,
          trim: true,
          lowercase: true,
          default: 'string',
        },
        fieldValue: {},
      },
    ],
    location: {
      latitude: Number,
      longitude: Number,
    },
    address: String,
    city: String,
    state: String,
    postalCode: Number,
    country: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    otherPhone: [
      {
        type: String,
        trim: true,
      },
    ],
    fax: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    otherEmail: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    website: {
      type: String,
      trim: true,
      lowercase: true,
    },
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      linkedin: String,
      tiktok: String,
      youtube: String,
      snapchat: String,
    },
    images: [
      {
        id: String,
        name: String,
        path: String,
        description: String,
        isPublic: {
          type: Boolean,
          default: false,
        },
      },
    ],
    files: [
      {
        id: String,
        name: String,
        path: String,
        description: String,
        isPublic: {
          type: Boolean,
          default: false,
        },
      },
    ],
    category: String,
    approved: {
      type: Boolean,
      default: true,
    },
    verified: {
      type: Boolean,
    },
    notes: String,
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseAutopopulate);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

export default model<iCompanyDocument, PaginateModel<iCompanyDocument>>('Company', schema);
