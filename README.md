This is a [NextJS learning process](https://github.com/nntvi/nextjs2024) project bootstrapped with [`create-next-app`](https://github.com/nntvi/nextjs2024).

#### ! Share global state user với các component con thông qua Context

Root Layout là layout tổng, chỉ chạy 1 lần duy nhất khi App của chúng ta chạy

Nếu như mình gọi `me` (để lấy thông tin người dùng vừa đăng nhập) tại header thì không thể chia sẻ cho các component khác được

```bash
 const cookiesStore = cookies();
  const sessionToken = cookiesStore.get("sessionToken")?.value;
  let user = null;
  if (sessionToken) {
    const data = await accountApiRequest.me(sessionToken);
    user = data.payload.data;
  }
```

=> Chính vì vậy cần xử lý lại chỗ này, lưu vào context để sử dụng nhiều nơi

- Bước 1: đem đoạn code bên trên gọi ở root layout
- Bước 2: đem thông tin vừa gọi được truyền vào AppProvider
- Bước 3: Tạo AppContext ở App Provider

  ```bash
  const AppContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
  }>({
  user: null,
  setUser: () => {},
  });
  export const useAppContext = () => {
  const context = useContext(AppContext);
  return context;
  };
  ```

- Bước 4: AppProvider là 1 component cung cấp data cho các component con thông qua context. Vì vậy, khởi tạo thêm state `user` quản lý thông tin user (nếu có)

  ```bash
  export default function AppProvider({
  children,
  initialSessionToken = "",
  user: userProp,
  }: {
  children: React.ReactNode;
  initialSessionToken: string;
  user?: User | null;
  }) {
      const [user, setUser] = useState<User | null>(userProp || null);
      useState(() => {
          if (typeof window !== "undefined") {
          clientSessionToken.value = initialSessionToken;
          }
      });

      return (
          <AppContext.Provider value={{ user, setUser }}>
          {children}
          </AppContext.Provider>
      );
  }
  ```

- Bước 5: ở những page khác để lấy thông tin user đã đăng nhập chỉ cần
  ```bash
  const { user } = useAppContext();
  ```

#### ! Page Product Detail dành cho khách hàng

Sẽ có 2 trường hợp

- User chưa login -> vào page products -> click xem chi tiết -> đi đến page dành cho người chưa login

- User đã login -> vào page products -> click xem chi tiết -> đi đến page chứa thông tin product hiện sẵn ở form

Vậy thì cách giải quyết đầu tiên là sửa lại url

- products
- - [id]
- - - edit
- - - - page.tsx -> form detail product cho người đã login
- - - pages.tsx -> page detail cho mọi người (kể cả chưa login)

=> url sẽ chia ra làm 2 loại như sau
`..../products/5` -> detail chung
`.../products/5/edit` -> detail đã login

Vậy ở phần này việc quan trọng là sửa ở middleware. Nếu như chưa login mà user gõ đường dẫn như `.../products/5/edit` này thì phải quay về lại page login. Thế thôi

```bash
import { NextRequest, NextResponse } from "next/server";

const privatePaths = ["/me"];
const authPaths = ["/login", "/register"];
const productEditRegex = /^\/products\/\d+\/edit$/;

export function middleware(request: NextRequest) {
 const { pathname } = request.nextUrl;
 const sessionToken = request.cookies.get("sessionToken")?.value;

 if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
   return NextResponse.redirect(new URL("/login", request.url));
 }

 if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
   return NextResponse.redirect(new URL("/me", request.url));
 }

 // Kiểm tra URL "/products/:id/edit" bằng regex test
 if (productEditRegex.test(pathname) && !sessionToken) {
   return NextResponse.redirect(new URL("/login", request.url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: ["/login", "/register", "/me", "/products/:path*"],
};
```

Chỗ cần lưu ý là matcher "/products/:path\*" => chỉ cần url là products/... ta sẽ kiểm tra nó có phù hợp với `productEditRegex` không. Nếu đúng là đường dẫn edit mà ko có `sessionToken` nghĩa là chưa login => đá về login

#### ! SEO title và description
