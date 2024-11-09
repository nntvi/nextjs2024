import envConfig from "@/config";
import { normalizePath } from "@/lib/utils";
import { LoginResType } from "@/schemaValidations/auth.schema";
import { redirect } from "next/navigation";

const promiseDelay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
type CustomRequestInit = RequestInit & {
  baseUrl?: string | undefined;
};

const ENTITY_ERROR_STATUS = 422;
const AUTHORIZATION_ERROR_STATUS = 401;

type EntityErrorPayload = {
  message: string;
  errors: {
    field: string;
    message: string;
  }[];
};
export class HttpError extends Error {
  status: number;
  payload: {
    message: string;
    [key: string]: any;
  };
  constructor({ status, payload }: { status: number; payload: any }) {
    super("Http Error");
    this.status = status;
    this.payload = payload;
  }
}

export class EntityError extends HttpError {
  status: 422;
  payload: EntityErrorPayload;

  constructor({
    status,
    payload,
  }: {
    status: 422;
    payload: EntityErrorPayload;
  }) {
    super({ status, payload });
    this.status = status;
    this.payload = payload;
  }
}
class SessionToken {
  private token = "";
  private _expiresAt = new Date().toISOString();
  get value() {
    return this.token;
  }
  set value(token: string) {
    // nếu gọi method này ở server sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }

    this.token = token;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  set expiresAt(expiresAt: string) {
    // nếu gọi method này ở server sẽ bị lỗi
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this._expiresAt = expiresAt;
  }
}
// chỉ lưu token ở client thôi
export const clientSessionToken = new SessionToken();
let clientLogoutRequest: null | Promise<any> = null;

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomRequestInit | undefined
) => {
  const body = options?.body
    ? options.body instanceof FormData
      ? options.body
      : JSON.stringify(options.body)
    : undefined;
  const baseHeaders =
    body instanceof FormData
      ? {
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        }
      : {
          "Content-Type": "application/json",
          Authorization: clientSessionToken.value
            ? `Bearer ${clientSessionToken.value}`
            : "",
        };
  // nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đầu Next.js Server

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;
  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    method,
    body,
  });
  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  if (!res.ok) {
    if (res.status === ENTITY_ERROR_STATUS) {
      throw new EntityError(
        data as { status: 422; payload: EntityErrorPayload }
      );
    } else if (res.status === AUTHORIZATION_ERROR_STATUS) {
      if (typeof window !== "undefined") {
        if (!clientLogoutRequest) {
          clientLogoutRequest = fetch("/api/auth/logout", {
            method: "POST",
            headers: {
              ...baseHeaders,
            } as any,
            body: JSON.stringify({
              force: true,
            }),
          });
          await clientLogoutRequest;
          clientSessionToken.value = "";
          clientSessionToken.expiresAt = new Date().toISOString();
          clientLogoutRequest = null;
          location.href = "/login";
        }
      } else {
        const sessionToken = (options?.headers as any)?.Authorization?.split(
          "Bearer "
        )[1];
        redirect(`/logout?sessionToken=${sessionToken}`);
      }
    } else {
      throw new HttpError(data);
    }
  }
  // đảm bảo việc xử lý chỉ chạy ở phía client
  if (typeof window !== "undefined") {
    if (
      ["auth/login", "auth/register"].some(
        (item) => item === normalizePath(url)
      )
    ) {
      clientSessionToken.value = (payload as LoginResType).data.token;
    } else if ("auth/logout" === normalizePath(url)) {
      clientSessionToken.value = "";
      clientSessionToken.expiresAt = new Date().toISOString();
    }
  }
  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomRequestInit, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    body: any,
    options?: Omit<CustomRequestInit, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options, body });
  },
};

export default http;
