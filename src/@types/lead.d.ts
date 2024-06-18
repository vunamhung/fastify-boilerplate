import { ObjectId } from 'mongoose';

interface iLead {
  name: string;
  removed: boolean;
  enabled: boolean;
  type: string;
  company: ObjectId;
  people: ObjectId;
  interestedIn: ObjectId;
  offer: ObjectId;
  converted: boolean;
  createdBy: ObjectId;
  assigned: ObjectId;
  subTotal: number;
  taxTotal: number;
  total: number;
  discount: number;
  images: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  files: {
    id: string;
    name: string;
    path: string;
    description: string;
    isPublic: boolean;
  }[];
  category: string;
  status: string;
  notes: string;
  source: string;
  approved: boolean;
  tags: string[];
}
