import accountApiRequest from "@/apiRequests/account";
import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/toggle-theme";
import { cookies } from "next/headers";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

export default async function HeaderComponent() {
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;
  let user = null;
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken);
    user = data.payload.data;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-md mb-5">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <Link href="/" className="text-xl font-bold">
            🌟 MyWebsite
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
          >
            <span>Home</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
          >
            <span>Products</span>
          </Link>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Xin chào, {user.name}</span>
              <Button variant="secondary" size="sm">
                <ButtonLogout />
              </Button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
              >
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center space-x-2 text-sm font-medium text-primary hover:underline"
              >
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>

        {/* Theme Toggle */}
        <ModeToggle />
      </div>
    </header>
  );
}
