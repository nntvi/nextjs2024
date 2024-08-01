"use client";
import { useRouter } from "next/router";
import React from "react";

export default function ButtonRedirect() {
  const router = useRouter();

  const handleNavigate = () => {
    router.push("/");
  };
  return (
    <div>
      <button onClick={handleNavigate}>Home</button>
    </div>
  );
}

// phân biệt nè
// Link: hover zoo chỗ click hiện url, có thể click phải để chuyển trang => UX tốt
// useRouter -> router.push: sử dụng trong function, thực hiện xong thao tác nào đó và cần quay về trang nào đó => ko hiện link khi hover
// redirect: sử dụng được trong quá trình render chứ ko sử dụng được trong hàm. Ví dụ, check isAuthentication ? về login : về home
