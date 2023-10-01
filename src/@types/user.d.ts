interface iToken {
  id: string;
  password: string;
  email: string;
  fullName: string;
  permissions: string[];
  auth: string;
  refreshToken: string;
}

interface iRefreshToken {
  jti: string;
}
