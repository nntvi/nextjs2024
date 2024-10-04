import authApiRequest from "@/apiRequests/auth";
import { cookies } from "next/headers";
import { HttpError } from "@/lib/http";
export async function POST(request: Request) {
  const res = await request.json();
  const force = res.force as boolean | undefined;
  if (force) {
    // nếu client truyền lên 1 giá trị force ngoài body thì bắt buộc đăng xuất
    // dành cho TH token hết hạn
    return Response.json(
      {
        message: "Buộc đăng xuất",
      },
      {
        status: 200,
        headers: {
          // Xóa cookie sessionToken
          "Set-Cookie": `sessionToken=; Path=/; HttpOnly; Max-Age=0`,
        },
      }
    );
  }
  const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken");
  if (!sessionToken) {
    return Response.json(
      { message: "Không nhận được session token" },
      {
        status: 401,
      }
    );
  }
  try {
    const result = await authApiRequest.logoutFromNextServerToServer(
      sessionToken.value
    );
    return Response.json(result.payload, {
      status: 200,
      headers: {
        "Set-Cookie": `sessionToken=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`,
      },
    });
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, {
        status: error.status,
      });
    } else {
      return Response.json(
        { message: "Lỗi không xác định" },
        {
          status: 500,
        }
      );
    }
  }
}
