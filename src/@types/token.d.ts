interface iToken {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  auth: string;
  refreshToken: string;
}

interface iRefreshToken {
  jti: string;
}
