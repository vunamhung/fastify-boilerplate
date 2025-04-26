import type { PaginateModel } from 'mongoose';
import type { SoftDeleteDocument, SoftDeleteModel } from 'mongoose-delete';
import { userSchema } from '~/schema';
import { zodSchemaRaw } from '~/utils/zod-mongoose';
import { model, Schema } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import { z } from 'zod';

interface iDoc extends SoftDeleteDocument, z.infer<typeof userSchema> {}
const schema = new Schema<iDoc>(zodSchemaRaw(userSchema) as unknown, { timestamps: true });

schema.index({ '$**': 'text' });
schema.plugin(mongooseAutopopulate);
schema.plugin(mongoosePaginate);
schema.plugin(mongooseDelete, { deletedAt: true, deletedBy: true });

export default model<iDoc, SoftDeleteModel<iDoc> & PaginateModel<iDoc>>('User', schema);
