import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  RegisterBodyType,
  RegisterResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

const authApiRequest = {
  login: async (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),
  register: async (body: RegisterBodyType) =>
    http.post<RegisterResType>("/auth/register", body),

  auth: (body: { sessionToken: string }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post<MessageResType>(
      "/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      }
    ),
  logoutFromNextClientToServer: () =>
    http.post<MessageResType>(
      "/api/logout",
      {},
      {
        baseUrl: "",
      }
    ),
};

export default authApiRequest;
