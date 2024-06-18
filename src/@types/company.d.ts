import { ObjectId } from 'mongoose';

interface iCompany {
  name: string;
  removed: boolean;
  enabled: boolean;
  hasParentCompany: boolean;
  legalName: string;
  source: string;
  parentCompany: ObjectId;
  isClient: boolean;
  peoples: ObjectId;
  mainContact: ObjectId;
  icon: string;
  logo: string;
  imageHeader: string;
  bankName: string;
  bankIban: string;
  bankSwift: string;
  bankNumber: string;
  bankRouting: string;
  bankCountry: string;
  companyRegNumber: string;
  companyTaxNumber: string;
  companyTaxId: string;
  companyRegId: string;
  customField: {
    fieldName: string;
    fieldType: string;
    fieldValue: string;
  }[];
  location: {
    latitude: number;
    longitude: number;
  };
  address: string;
  city: string;
  state: string;
  postalCode: number;
  country: string;
  phone: string;
  otherPhone: string[];
  fax: string;
  email: string;
  otherEmail: string[];
  website: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    tiktok: string;
    youtube: string;
    snapchat: string;
  };
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
  approved: boolean;
  verified: boolean;
  notes: string;
  tags: string[];
  isPublic: boolean;
}
