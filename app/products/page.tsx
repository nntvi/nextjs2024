import productApiRequest from "@/apiRequests/product";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList();
  const productList = payload.data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Product List
      </h1>
      <Link
        href="/products/add"
        className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white font-semibold text-md rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
      >
        Create Product
      </Link>{" "}
      <div className="space-y-6">
        {productList.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 space-x-4"
          >
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
            <div className="flex space-x-2">
              <Link href={`/products/${product.id}`}>
                <Button variant="outline" className="px-4 py-2">
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" className="px-4 py-2">
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
