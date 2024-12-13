import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import { baseOpenGraph } from "@/app/shared-metadata";
import envConfig from "@/config";
import { ResolvingMetadata } from "next";
import Image from "next/image";
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
  // const url = envConfig.NEXT_PUBLIC_API + "/products/" + product.id;
  const url = "/products/" + product.id;
  return {
    openGraph: {
      title: product.name,
      description: product.description,
      url,
      siteName: "Producto",
      images: [
        {
          url: "https://nextjs.org/og.png", // Must be an absolute URL
          width: 800,
          height: 600,
        },
      ],
      ...baseOpenGraph,
    },
  };
}

export default async function ProductDetail({ params, searchParams }: Props) {
  let product = null;
  const { payload } = await getDetail(Number(params.id));
  product = payload.data;
  return (
    <div>
      {!product && <div>Không tìm thấy máy tính</div>}
      {product && (
        <div>
          <Image
            src={product.image}
            alt={product.name}
            width={100}
            height={100}
            className="w-32 h-32 object-cover rounded-md"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800">
              {product.name}
            </h3>
            <p className="text-lg text-gray-600">${product.price}</p>
          </div>
        </div>
      )}
    </div>
  );
}
