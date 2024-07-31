export const jwtConstants = {
  secret: process.env.AUTH_SECRET || '',
  signature: process.env.AUTH_SIGNATURE || '',
};
