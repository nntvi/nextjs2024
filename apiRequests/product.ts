import http from "@/lib/http";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  ProductListResType,
  ProductResType,
  UpdateProductBodyType,
} from "@/schemaValidations/product.schema";

const productApiRequest = {
  getList: () =>
    http.get<ProductListResType>("/products", { cache: "no-store" }),
  getDetail: (id: number) =>
    http.get<ProductResType>(`/products/${id}`, {
      cache: "no-store",
    }),
  create: (body: any) => http.post<ProductResType>("/products", body),
  update: (id: number, body: UpdateProductBodyType) =>
    http.put<ProductResType>(`/products/${id}`, body),
  delete: (id: number) => http.delete<MessageResType>(`/products/${id}`, {}),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string;
      data: string;
    }>("/media/upload", body),
};

export default productApiRequest;
