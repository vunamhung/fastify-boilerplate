import type { iClient } from '~/@types/client';
import type { Document } from 'mongoose';
import { model, PaginateModel, Schema } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';

const { String, Boolean, ObjectId } = Schema.Types;

export interface iClientDocument extends Document, iClient {}

const schema = new Schema<iClientDocument>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    source: String,
    category: String,
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
    convertedFrom: {
      type: ObjectId,
      ref: 'Lead',
    },
    interestedIn: [
      {
        type: ObjectId,
        ref: 'Product',
      },
    ],
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    assigned: {
      type: ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

schema.plugin(mongooseAutopopulate);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

export default model<iClientDocument, PaginateModel<iClientDocument>>('Client', schema);
