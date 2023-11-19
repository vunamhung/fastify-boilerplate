interface iUserToken {
  id: string;
  email: string;
  fullName: string;
  permissions: string[];
  jti: string;
}

interface iRefreshToken {
  jti: string;
  exp: number;
}
