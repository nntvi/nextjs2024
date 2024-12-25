import jwt from "jsonwebtoken";

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
export const decodeJWT = <Payload = any>(token: string) => {
  return jwt.decode(token) as Payload;
};
