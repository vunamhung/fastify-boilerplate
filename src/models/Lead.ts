import type { iLead } from '~/@types/lead';
import type { Document } from 'mongoose';
import { model, PaginateModel, Schema } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

const { String, Boolean, ObjectId, Number } = Schema.Types;

export interface iLeadDocument extends Document, iLead {}

const schema = new Schema<iLeadDocument>(
  {
    name: {
      type: String,
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
    type: {
      type: String,
      default: 'company',
      enum: ['company', 'people'],
      required: true,
    },
    company: {
      type: ObjectId,
      ref: 'Company',
      autopopulate: true,
    },
    people: {
      type: ObjectId,
      ref: 'People',
      autopopulate: true,
    },
    interestedIn: [
      {
        type: ObjectId,
        ref: 'Product',
      },
    ],
    offer: [
      {
        type: ObjectId,
        ref: 'Offer',
      },
    ],
    converted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    assigned: {
      type: ObjectId,
      ref: 'User',
    },
    subTotal: Number,
    taxTotal: Number,
    total: Number,
    discount: Number,
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
    status: String,
    notes: String,
    source: String,
    approved: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseAutopopulate);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

export default model<iLeadDocument, PaginateModel<iLeadDocument>>('Lead', schema);
