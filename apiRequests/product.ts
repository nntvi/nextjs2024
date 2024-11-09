import http from "@/lib/http";
import { ProductResType } from "@/schemaValidations/product.schema";

const productApiRequest = {
  get: () => http.get("/products"),
  getDetail: (id: number) => http.get(`/products/${id}`),
  create: (body: any) => http.post<ProductResType>("/products", body),
  uploadImage: (body: FormData) =>
    http.post<{
      message: string;
      data: string;
    }>("/media/upload", body),
  update: (id: number, body: any) => http.put(`/products/${id}`, body),
};

export default productApiRequest;
