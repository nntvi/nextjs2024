import productApiRequest from "@/apiRequests/product";
import ProductAddForm from "@/app/products/_components/product-add-form";
import Image from "next/image";

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  let product = null;
  const { payload } = await productApiRequest.getDetail(Number(params.id));
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
