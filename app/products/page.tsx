import productApiRequest from "@/apiRequests/product";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

export default async function ProductListPage() {
  const { payload } = await productApiRequest.getList();
  const productList = payload.data;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Product List
      </h1>
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
              <Button variant="outline" className="px-4 py-2">
                Edit
              </Button>
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
