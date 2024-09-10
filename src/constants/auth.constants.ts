export const jwtConstants = {
  secret: process.env.AUTH_SECRET || '',
  signature: process.env.AUTH_SIGNATURE || '',
};

export const adminJwtConstants = {
  secret: String(process.env.ADMIN_JWT_SECRET_KEY),
};
