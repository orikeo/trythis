export const authConfig = {
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_EXPIRES_DAYS) || 7,
};