import productApiRequest from "@/apiRequests/product";
import DeleteProduct from "@/app/products/_components/delete-product";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
  description: "Created by Vi Aibi",
};
export default async function ProductListPage() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken")?.value;
  const isAuthenticated = Boolean(sessionToken);
  const { payload } = await productApiRequest.getList();
  const productList = payload.data;

  return (
    <div className="p-8  min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Product List
      </h1>
      {isAuthenticated && (
        <Link
          href="/products/add"
          className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white font-semibold text-md rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        >
          Create Product
        </Link>
      )}
      <div className="space-y-6">
        {productList.map((product) => (
          <div
            key={product.id}
            className="flex items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 space-x-4"
          >
            <Link href={`/products/${product.id}`}>
              <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className="w-32 h-32 object-cover rounded-md"
              />
            </Link>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-lg text-gray-600">${product.price}</p>
            </div>
            {isAuthenticated && (
              <div className="flex space-x-2">
                <Link href={`/products/${product.id}/edit`}>
                  <Button variant="outline" className="px-4 py-2">
                    Edit
                  </Button>
                </Link>
                <DeleteProduct product={product} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
