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
