export type User = {
  id: string;
  username: string;
  password: string;
  enabled: boolean;
};

export type AuthDataProps = {
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_in: string;
  scope: string;
  user: User;
  accessType: string;
  refreshToken: string;
  expiresIn: string;
};
