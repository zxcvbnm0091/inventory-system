export type JWTAccessPayload = {
  id: string;
  email: string;
  role: string;
};

export type JWTRefreshPayload = {
  userId: string;
};
