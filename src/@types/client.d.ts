import { ObjectId } from 'mongoose';

interface iClient {
  removed: boolean;
  enabled: boolean;
  type: string;
  name: string;
  source: string;
  category: string;
  company: ObjectId;
  people: ObjectId;
  convertedFrom: ObjectId;
  interestedIn: ObjectId;
  createdBy: ObjectId;
  assigned: ObjectId;
}
