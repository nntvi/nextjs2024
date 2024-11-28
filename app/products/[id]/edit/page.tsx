import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { ResolvingMetadata } from "next";
import { cache } from "react";
const getDetail = cache(productApiRequest.getDetail);
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
) {
  const { payload } = await getDetail(Number(params.id));
  const product = payload.data;
  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductEdit({ params, searchParams }: Props) {
  let product = undefined;
  try {
    const { payload } = await getDetail(Number(params.id));
    product = payload.data;
  } catch (error) {}
  return (
    <div>
      {!product && <div>Không tìm thấy sản phẩm</div>}
      <ProductAddForm product={product} />
    </div>
  );
}
