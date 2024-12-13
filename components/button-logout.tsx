"use client";
import authApiRequest from "@/apiRequests/auth";
import { useAppContext } from "@/app/AppProvider";
import { Button } from "@/components/ui/button";
import { handleErrorApi } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

export default function ButtonLogout() {
  const { user } = useAppContext();
  console.log("🚀 ~ ButtonLogout ~ user:", user);
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = async () => {
    try {
      await authApiRequest.logoutFromNextClientToServer();
      router.push("/login");
    } catch (error) {
      handleErrorApi({
        error,
      });
      authApiRequest.logoutFromNextClientToServer(true).then((res) => {
        router.push(`login?redirectFrom=${pathname}`);
      });
    } finally {
      localStorage.removeItem("sessionToken");
      localStorage.removeItem("sessionTokenExpiresAt");
      router.refresh();
    }
  };
  return (
    <Button size={"sm"} onClick={handleLogout}>
      Logout
    </Button>
  );
}
