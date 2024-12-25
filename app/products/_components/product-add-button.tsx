"use client";
import { isClient } from "@/lib/http";
import Link from "next/link";

export default function ProductAddButton() {
  const isAuthenticated =
    isClient() && Boolean(localStorage.getItem("sessionToken"));
  if (!isAuthenticated) return null;

  return (
    <Link
      href="/products/add"
      className="inline-block mb-6 px-6 py-2 bg-blue-600 text-white font-semibold text-md rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
    >
      Create Product
    </Link>
  );
}
