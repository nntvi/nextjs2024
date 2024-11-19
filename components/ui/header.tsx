import ButtonLogout from "@/components/button-logout";
import { ModeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";
import { AccountResType } from "@/schemaValidations/account.schema";
import Link from "next/link";

export default async function HeaderComponent({
  user,
}: {
  user: AccountResType["data"] | null;
}) {
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
            <Link href="/me" className="flex items-center space-x-4">
              <span className="text-sm font-medium">Xin chào, {user.name}</span>
              <Button variant="secondary" size="sm">
                <ButtonLogout />
              </Button>
            </Link>
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
