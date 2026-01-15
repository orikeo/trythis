import { Secret, SignOptions } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not set");
}

export const jwtConfig = {
  secret: secret as Secret,
  expiresIn: "15m" as SignOptions["expiresIn"],
};