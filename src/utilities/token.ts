export interface iToken {
  id: string;
  email: string;
  role: string;
  auth: string;
  verified?: boolean;
  jti: string;
}
