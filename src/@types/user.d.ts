interface iUser {
  id: string;
  password: string;
  email: string;
  fullName: string;
  permissions: string[];
  auth: string;
  refreshToken: string;
}

interface iSearch<T> {
  total: number;
  documents: {
    id: string;
    value: T;
  }[];
}
