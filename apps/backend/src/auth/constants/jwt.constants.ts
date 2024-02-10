export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'defaultSecret',
  expiresIn: process.env.JWT_EXPIRATION_TIME || '60m',
};
